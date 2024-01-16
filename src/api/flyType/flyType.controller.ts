import type { Request, Response, NextFunction } from 'express';
import { FilterQuery, FindOptions, RequestContext } from '@mikro-orm/core';
import { FlyType } from './flyType.entity.js';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { Fly } from '../fly/fly.entity.js';
import { mapEntityDbModelToResourceModel } from '../../core/utils.js';
import { FlyTypeResourceModel } from './flyType.types.js';
import { FlyResourceModel } from '../fly/fly.types.js';
import { userHasPermission } from '../user/user.service.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';

export const indexFlyTypes = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyTypeResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const filterQuery: FilterQuery<FlyType> = {};
    const findOptions: FindOptions<FlyType> = {
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        orderBy: { name: 'ASC' },
    };

    const results = await repository?.findAndCount(filterQuery, findOptions);

    if (!results) {
        const error = new ApiException({ message: 'Unable to fetch fly types' });
        return next(error);
    }

    const flyTypes = results[0];
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
        results: flyTypes.map((x) => mapEntityDbModelToResourceModel(x)),
    });
};

export const getFlyType = async (
    req: Request,
    res: Response<FlyTypeResourceModel>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const result = await repository?.findOne({ externalId: req.params.id });

    if (!result) {
        const error = new ApiException({ message: `Cannot find fly type using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    res.json(mapEntityDbModelToResourceModel(result));
};

export const createFlyType = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const userId = req.body.user.userId;
    const hasPermission = await userHasPermission(userId, UserPermissionName.CREATE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    const exists = await repository?.exists(req.body.name);

    if (exists) {
        const error = new ApiException({ message: 'Fly type name already exists', status: 409 });
        return next(error);
    }

    const flyType = new FlyType(req.body.name, req.body.description);

    await em?.persist(flyType).flush();
    res.json(flyType.externalId);
};

export const updateFlyType = async (
    req: Request,
    res: Response<FlyTypeResourceModel>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const userId = req.body.user.userId;
    const hasPermission = await userHasPermission(userId, UserPermissionName.CREATE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    const flyType = await repository?.findOne({ externalId: req.params.id });

    if (!flyType) {
        const error = new ApiException({ message: `Cannot find fly type using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    flyType.name = req.body.name;
    flyType.description = req.body.description;

    await em?.flush();
    res.json(mapEntityDbModelToResourceModel(flyType));
};

export const deleteFlyType = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const userId = req.body.user.userId;
    const hasPermission = await userHasPermission(userId, UserPermissionName.DELETE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    const result = await repository?.nativeDelete({ externalId: req.params.id });

    if (result === 0) {
        const error = new ApiException({ message: `Cannot find fly type using id: ${req.params.id}` });
        return next(error);
    }

    res.json('OK');
};

export const indexFliesByType = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const flyRepository = em?.getRepository(Fly);

    const flyType = await repository?.findOne({ externalId: req.params.id });

    if (!flyType) {
        const error = new ApiException({ message: `Cannot find fly type using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const filterQuery: FilterQuery<Fly> = { types: flyType.id };
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
