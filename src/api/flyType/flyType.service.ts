import { FilterQuery, FindOptions, RequestContext } from '@mikro-orm/core';
import { FlyType } from './flyType.entity.js';
import ApiException from '../../core/ApiException.js';
import type { FlyTypeResourceModel } from './flyType.types.js';
import { mapEntityDbModelToResourceModel } from '../../core/utils.js';
import type { IndexPaginatedEntityResponse, PaginatedEntityMetadata } from '../../core/types.js';
import { Fly } from '../fly/fly.entity.js';
import { FlyResourceModel } from '../fly/fly.types.js';

export const indexFlyTypes = async (
    pageNumber: PaginatedEntityMetadata['pageNumber'],
    pageSize: PaginatedEntityMetadata['pageSize'],
): Promise<IndexPaginatedEntityResponse<FlyTypeResourceModel>> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const filterQuery: FilterQuery<FlyType> = {};
    const findOptions: FindOptions<FlyType> = {
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        orderBy: { name: 'ASC' },
    };

    const results = await repository?.findAndCount(filterQuery, findOptions);

    if (!results) {
        throw new ApiException({ message: 'Unable to fetch fly types' });
    }

    const flyTypes: Array<FlyType> = results[0];
    const totalItems: number = results[1] || 0;
    const totalPages: number = totalItems <= pageSize ? 1 : Math.ceil(totalItems / pageSize);

    return {
        metadata: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
        },
        results: flyTypes.map(x => mapEntityDbModelToResourceModel(x)),
    };
};

export const getFlyType = async (id: FlyTypeResourceModel['id']): Promise<FlyTypeResourceModel> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);

    const result = await repository?.findOne({ externalId: id });

    if (!result) {
        throw new ApiException({ message: `Cannot find fly type using id: ${id}`, status: 409 });
    }

    return mapEntityDbModelToResourceModel(result);
};

export const createFlyType = async (
    name: FlyType['name'],
    description: FlyType['description'],
): Promise<FlyTypeResourceModel['id']> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);

    const exists = await repository?.exists(name);

    if (exists) {
        throw new ApiException({ message: 'Fly type name already exists', status: 409 });
    }

    const flyType = new FlyType(name, description || '');

    await em?.persist(flyType).flush();
    return flyType.externalId;
};

export const updateFlyType = async (data: any): Promise<FlyTypeResourceModel> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);

    const flyType = await repository?.findOne({ externalId: data.id });

    if (!flyType) {
        throw new ApiException({ message: `Cannot find fly type using id: ${data.id}`, status: 409 });
    }

    flyType.name = data.name;
    flyType.description = data.description;

    await em?.flush();
    return mapEntityDbModelToResourceModel(flyType);
};

export const deleteFlyType = async (id: FlyTypeResourceModel['id']): Promise<boolean> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);

    const result = await repository?.nativeDelete({ externalId: id });

    if (result === 0) {
        throw new ApiException({ message: `Cannot find fly type using id: ${id}` });
    }

    return true;
};

export const indexFliesByType = async (data: any): Promise<IndexPaginatedEntityResponse<FlyResourceModel>> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(FlyType);
    const flyRepository = em?.getRepository(Fly);

    const flyType = await repository?.findOne({ externalId: data.id });

    if (!flyType) {
        throw new ApiException({ message: `Cannot find fly type using id: ${data.id}`, status: 409 });
    }

    const filterQuery: FilterQuery<Fly> = { types: flyType.id };
    const findOptions: FindOptions<Fly> = {
        offset: (data.pageNumber - 1) * data.pageSize,
        limit: data.pageSize,
        populate: ['types', 'imitatees'] as never,
        orderBy: { name: 'ASC' },
    };

    const results = await flyRepository?.findAndCount(filterQuery, findOptions);

    if (!results) {
        throw new ApiException({ message: 'Unable to fetch flies' });
    }

    const flies: Array<Fly> = results[0];
    const totalItems: number = results[1] || 0;
    const totalPages: number = totalItems <= data.pageSize ? 1 : Math.ceil(totalItems / data.pageSize);

    const mappedResults: Array<FlyResourceModel> = flies.map(x => {
        const { externalId: _externalId, id: _id, ...entityModel } = x;
        return {
            ...entityModel,
            id: x.externalId,
            imitatees: x.imitatees.toArray().map(mapEntityDbModelToResourceModel),
            types: x.types.toArray().map(mapEntityDbModelToResourceModel),
        };
    });

    return {
        metadata: {
            totalItems,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages,
        },
        results: mappedResults,
    };
};
