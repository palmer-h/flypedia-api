import type { Request, Response, NextFunction } from 'express';
import { FilterQuery, FindOptions, RequestContext } from '@mikro-orm/core';
import { Imitatee } from './imitatee.entity.js';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { Fly } from '../fly/fly.entity.js';
import { ImitateeResourceModel } from './imitatee.types.js';
import { mapEntityDbModelToResourceModel } from '../../core/utils.js';
import { FlyResourceModel } from '../fly/fly.types.js';
import { userHasPermission } from '../user/user.service.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';

export const indexImitatees = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<ImitateeResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const findOptions: FindOptions<Imitatee> = {
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        orderBy: { name: 'ASC' },
    };

    const results = await repository?.findAndCount({}, findOptions);

    if (!results) {
        const error = new ApiException({ message: 'Unable to fetch imitatees' });
        return next(error);
    }

    const imitatees = results[0];
    const totalItems = results[1];
    const totalPages = Math.ceil(totalItems / pageSize);

    res.setHeader('Content-Range', `bytes 0-${totalItems}/*`);
    res.json({
        metadata: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
        },
        results: imitatees.map((x) => mapEntityDbModelToResourceModel(x)),
    });
};

export const getImitatee = async (
    req: Request,
    res: Response<ImitateeResourceModel>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const result = await repository?.findOne({ externalId: req.params.id });

    if (!result) {
        const error = new ApiException({ message: `Cannot find imitatee using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    res.json(mapEntityDbModelToResourceModel(result));
};

export const createImitatee = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const userId = req.body.user.userId;
    const hasCreatePermission = await userHasPermission(userId, UserPermissionName.CREATE);

    if (!hasCreatePermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    const exists = await repository?.exists(req.body.name);

    if (exists) {
        const error = new ApiException({ message: 'Imitatee name already exists', status: 409 });
        return next(error);
    }

    const imitatee = new Imitatee(req.body.name, req.body.description);

    await em?.persist(imitatee).flush();
    res.json(imitatee.externalId);
};

export const updateImitatee = async (
    req: Request,
    res: Response<ImitateeResourceModel>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const imitatee = await repository?.findOne({ externalId: req.params.id });

    if (!imitatee) {
        const error = new ApiException({ message: `Cannot find imitatee using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    imitatee.name = req.body.name;
    imitatee.description = req.body.description;

    await em?.flush();
    res.json(mapEntityDbModelToResourceModel(imitatee));
};

export const deleteImitatee = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const result = await repository?.nativeDelete({ externalId: req.params.id });

    if (result === 0) {
        const error = new ApiException({ message: `Cannot find imitatee using id: ${req.params.id}` });
        return next(error);
    }

    res.json('OK');
};

export const indexFliesByImitatee = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const flyRepository = em?.getRepository(Fly);

    const imitatee = await repository?.findOne({ externalId: req.params.id });

    if (!imitatee) {
        const error = new ApiException({ message: `Cannot find imitatee using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const filterQuery: FilterQuery<Fly> = { types: imitatee.id };
    const findOptions: FindOptions<Fly> = {
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        populate: ['types', 'imitatees'] as never,
        orderBy: { name: 'ASC' },
    };

    const results = await flyRepository?.findAndCount(filterQuery, findOptions);

    if (!results) {
        const error = new ApiException({ message: 'Unable to fetch flies' });
        return next(error);
    }

    const flies = results[0];
    const totalItems = results[1];
    const totalPages = Math.ceil(totalItems / pageSize);

    const mappedResults: Array<FlyResourceModel> = flies.map((x) => {
        const { externalId: _externalId, id: _id, ...entityModel } = x;
        return {
            ...entityModel,
            id: x.externalId,
            imitatees: x.imitatees.toArray().map(mapEntityDbModelToResourceModel),
            types: x.types.toArray().map(mapEntityDbModelToResourceModel),
        };
    });

    res.setHeader('Content-Range', `bytes 0-${totalItems}/*`);
    res.json({
        metadata: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
        },
        results: mappedResults,
    });
};
