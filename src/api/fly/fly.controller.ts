import { FindOptions, RequestContext } from '@mikro-orm/core';
import type { Request, Response, NextFunction } from 'express';
import { Fly } from './fly.entity.js';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { Imitatee } from '../imitatee/imitatee.entity.js';
import { FlyType } from '../flyType/flyType.entity.js';
import { FlyResourceModel } from './fly.types.js';
import { mapEntityDbModelToResourceModel } from '../../core/utils.js';

export const indexFlies = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const findOptions: FindOptions<Fly> = {
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        populate: ['types', 'imitatees'] as never,
        orderBy: { name: 'ASC' },
    };

    const results = await repository?.findAndCount({}, findOptions);

    if (!results) {
        const error = new ApiException({ message: 'Unable to fetch flies' });
        return next(error);
    }

    const flies = results[0];
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
        results: flies.map((x) => mapEntityDbModelToResourceModel(x)),
    });
};

export const getFly = async (req: Request, res: Response<FlyResourceModel>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const result = await repository?.findOne({ externalId: req.params.id }, { populate: ['types', 'imitatees'] });

    if (!result) {
        const error = new ApiException({ message: `Cannot find fly using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    res.json(mapEntityDbModelToResourceModel(result));
};

export const createFly = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const flyTypeRepository = em?.getRepository(FlyType);
    const imitateeRepository = em?.getRepository(Imitatee);
    const exists = await repository?.exists(req.body.name);

    if (exists) {
        const error = new ApiException({ message: 'Fly name already exists', status: 409 });
        return next(error);
    }

    const fly = new Fly(req.body.name, req.body.description);

    const flyTypes: Array<FlyType> = [];
    const imitatees: Array<Imitatee> = [];

    for (let i = 0; i < req.body.types.length; i++) {
        const id = req.body.types[i];
        const flyType = await flyTypeRepository?.findOne({ externalId: id });
        if (!flyType) {
            const error = new ApiException({ message: `Cannot find fly type using ID ${id}` });
            return next(error);
        }
        const reference = flyTypeRepository?.getReference(flyType.id);
        if (!reference) {
            const error = new ApiException({ message: `Cannot find fly type using ID ${id}` });
            return next(error);
        }
        flyTypes.push(reference);
    }

    for (let i = 0; i < req.body.imitatees.length; i++) {
        const id = req.body.imitatees[i];
        const imitatee = await imitateeRepository?.findOne({ externalId: id });
        if (!imitatee) {
            const error = new ApiException({ message: `Cannot find imitatee using ID ${id}` });
            return next(error);
        }
        const reference = imitateeRepository?.getReference(imitatee.id);
        if (!reference) {
            const error = new ApiException({ message: `Cannot find imitatee using ID ${id}` });
            return next(error);
        }
        imitatees.push(reference);
    }

    fly.types.add(flyTypes);
    fly.imitatees.add(imitatees);

    await em?.persist(fly).flush();
    res.json(fly.externalId);
};

export const updateFly = async (req: Request, res: Response<FlyResourceModel>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const flyTypeRepository = em?.getRepository(FlyType);
    const imitateeRepository = em?.getRepository(Imitatee);
    const fly = await repository?.findOne({ externalId: req.params.id }, { populate: ['types', 'imitatees'] });

    if (!fly) {
        const error = new ApiException({ message: `Cannot find fly using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    const { name, description } = req.body;

    fly.name = name;
    fly.description = description;

    const flyTypes: Array<FlyType> = [];
    const imitatees: Array<Imitatee> = [];

    for (let i = 0; i < req.body.types.length; i++) {
        const id = req.body.types[i];
        const flyType = await flyTypeRepository?.findOne({ externalId: id });
        if (!flyType) {
            const error = new ApiException({ message: `Cannot find fly type using ID ${id}` });
            return next(error);
        }
        const reference = flyTypeRepository?.getReference(flyType.id);
        if (!reference) {
            const error = new ApiException({ message: `Cannot find fly type using ID ${id}` });
            return next(error);
        }
        flyTypes.push(reference);
    }

    for (let i = 0; i < req.body.imitatees.length; i++) {
        const id = req.body.imitatees[i];
        const imitatee = await imitateeRepository?.findOne({ externalId: id });
        if (!imitatee) {
            const error = new ApiException({ message: `Cannot find imitatee using ID ${id}` });
            return next(error);
        }
        const reference = imitateeRepository?.getReference(imitatee.id);
        if (!reference) {
            const error = new ApiException({ message: `Cannot find imitatee using ID ${id}` });
            return next(error);
        }
        imitatees.push(reference);
    }

    fly.types.set(flyTypes);
    fly.imitatees.set(imitatees);

    await em?.flush();
    res.json(mapEntityDbModelToResourceModel(fly));
};

export const deleteFly = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const result = await repository?.nativeDelete({ externalId: req.params.id });

    if (result === 0) {
        const error = new ApiException({ message: `Cannot find fly using id: ${req.params.id}` });
        return next(error);
    }

    res.json('OK');
};
