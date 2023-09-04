import type { Request, Response, NextFunction } from 'express';
import { FilterQuery, FindOptions, RequestContext } from '@mikro-orm/core';
import { FlyType } from './flyType.entity.js';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { Fly } from '../fly/fly.entity.js';

export const indexFlyTypes = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyType>>,
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
        results: flyTypes,
    });
};

export const getFlyType = async (req: Request, res: Response<FlyType>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const result = await repository?.findOne({ externalId: req.params.id });

    if (!result) {
        const error = new ApiException({ message: `Cannot find fly type using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    res.json(result);
};

export const createFlyType = async (
    req: Request,
    res: Response<FlyType['externalId']>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const exists = await repository?.exists(req.body.name);

    if (exists) {
        const error = new ApiException({ message: 'Fly type name already exists', status: 409 });
        return next(error);
    }

    const flyType = new FlyType(req.body.name);

    await em?.persist(flyType).flush();
    res.json(flyType.externalId);
};

export const updateFlyType = async (req: Request, res: Response<FlyType>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const flyType = await repository?.findOne({ externalId: req.params.id });

    if (!flyType) {
        const error = new ApiException({ message: `Cannot find fly type using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    flyType.name = req.body.name;

    await em?.flush();
    res.json(flyType);
};

export const deleteFlyType = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const result = await repository?.nativeDelete({ externalId: req.params.id });

    if (result === 0) {
        const error = new ApiException({ message: `Cannot find fly type using id: ${req.params.id}` });
        return next(error);
    }

    res.json('OK');
};

export const indexFliesByType = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<Fly>>,
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

    res.json({
        metadata: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
        },
        results: flies,
    });
};
