import type { Request, Response, NextFunction } from 'express';
import { FilterQuery, FindOptions, RequestContext } from '@mikro-orm/core';
import { Imitatee } from './imitatee.entity.js';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { Fly } from '../fly/fly.entity.js';

export const indexImitatees = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<Imitatee>>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const filterQuery: FilterQuery<Imitatee> = {};
    const findOptions: FindOptions<Imitatee> = {
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        orderBy: { name: 'ASC' },
    };

    const results = await repository?.findAndCount(filterQuery, findOptions);

    if (!results) {
        const error = new ApiException({ message: 'Unable to fetch imitatees' });
        return next(error);
    }

    const imitatees = results[0];
    const totalItems = results[1];
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
        metadata: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
        },
        results: imitatees,
    });
};

export const getImitatee = async (req: Request, res: Response<Imitatee>, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const result = await repository?.findOne({ externalId: req.params.id });

    if (!result) {
        const error = new ApiException({ message: `Cannot find imitatee using id: ${req.params.id}`, status: 409 });
        return next(error);
    }

    res.json(result);
};

export const createImitatee = async (
    req: Request,
    res: Response<Imitatee['externalId']>,
    next: NextFunction,
): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const exists = await repository?.exists(req.body.name);

    if (exists) {
        const error = new ApiException({ message: 'Imitatee name already exists', status: 409 });
        return next(error);
    }

    const imitatee = new Imitatee(req.body.name, req.body.description);

    await em?.persist(imitatee).flush();
    res.json(imitatee.externalId);
};

export const updateImitatee = async (req: Request, res: Response<Imitatee>, next: NextFunction): Promise<void> => {
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
    res.json(imitatee);
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
    res: Response<IndexPaginatedEntityResponse<Fly>>,
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
