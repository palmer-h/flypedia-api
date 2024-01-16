import { FindOptions, RequestContext } from '@mikro-orm/core';
import { Fly } from './fly.entity.js';
import ApiException from '../../core/ApiException.js';
import { FlyType } from '../flyType/flyType.entity.js';
import { Imitatee } from '../imitatee/imitatee.entity.js';
import type { FlyResourceModel } from './fly.types.js';
import { mapEntityDbModelToResourceModel } from '../../core/utils.js';
import type { IndexPaginatedEntityResponse, PaginatedEntityMetadata } from '../../core/types.js';

export const indexFlies = async (
    pageNumber: PaginatedEntityMetadata['pageNumber'],
    pageSize: PaginatedEntityMetadata['pageSize'],
): Promise<IndexPaginatedEntityResponse<FlyResourceModel>> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const findOptions: FindOptions<Fly> = {
        offset: (Number(pageNumber) - 1) * Number(pageSize),
        limit: pageSize,
        populate: ['types', 'imitatees'] as never,
        orderBy: { name: 'ASC' },
    };

    const results = await repository?.findAndCount({}, findOptions);

    if (!results) {
        throw new ApiException({ message: 'Unable to fetch flies' });
    }

    const flies = results[0];
    const totalItems = results[1];
    const totalPages = Math.ceil(totalItems / Number(pageSize));

    const mappedResults: Array<FlyResourceModel> = flies.map((x) => {
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
            pageNumber,
            pageSize,
            totalPages,
        },
        results: mappedResults,
    };
};

export const getFly = async (id: FlyResourceModel['id']): Promise<FlyResourceModel> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const result = await repository?.findOne({ externalId: id }, { populate: ['types', 'imitatees'] });

    if (!result) {
        throw new ApiException({ message: `Cannot find fly using id: ${id}`, status: 409 });
    }

    const { externalId: _externalId, id: _id, ...mappedResult } = result;
    const response: FlyResourceModel = {
        ...mappedResult,
        id: result.externalId,
        imitatees: result.imitatees.toArray().map(mapEntityDbModelToResourceModel),
        types: result.types.toArray().map(mapEntityDbModelToResourceModel),
    };

    return response;
};

export const createFly = async (data: any): Promise<FlyResourceModel['id']> => {
    const em = RequestContext.getEntityManager();

    const repository = em?.getRepository(Fly);
    const flyTypeRepository = em?.getRepository(FlyType);
    const imitateeRepository = em?.getRepository(Imitatee);

    const exists = await repository?.exists(data.name);

    if (exists) {
        throw new ApiException({ message: 'Fly name already exists', status: 409 });
    }

    const newFly = new Fly(data.name, data.description);

    const flyTypes: Array<FlyType> = [];
    const imitatees: Array<Imitatee> = [];

    for (let i = 0; i < data.types.length; i++) {
        const id = data.types[i];

        const flyType = await flyTypeRepository?.findOne({ externalId: id });
        if (!flyType) {
            throw new ApiException({ message: `Cannot find fly type using ID ${id}` });
        }

        const reference = flyTypeRepository?.getReference(flyType.id);
        if (!reference) {
            throw new ApiException({ message: `Cannot find fly type using ID ${id}` });
        }

        flyTypes.push(reference);
    }

    for (let i = 0; i < data.imitatees.length; i++) {
        const id = data.imitatees[i];
        const imitatee = await imitateeRepository?.findOne({ externalId: id });
        if (!imitatee) {
            throw new ApiException({ message: `Cannot find imitatee using ID ${id}` });
        }
        const reference = imitateeRepository?.getReference(imitatee.id);
        if (!reference) {
            throw new ApiException({ message: `Cannot find imitatee using ID ${id}` });
        }
        imitatees.push(reference);
    }

    newFly.types.add(flyTypes);
    newFly.imitatees.add(imitatees);

    await em?.persist(newFly).flush();

    return newFly.externalId;
};

export const updateFly = async (data: any): Promise<FlyResourceModel> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);
    const flyTypeRepository = em?.getRepository(FlyType);
    const imitateeRepository = em?.getRepository(Imitatee);

    const fly = await repository?.findOne({ externalId: data.id }, { populate: ['types', 'imitatees'] });

    if (!fly) {
        throw new ApiException({ message: `Cannot find fly using id: ${data.id}`, status: 409 });
    }

    const { name, description } = data;

    fly.name = name;
    fly.description = description;

    const flyTypes: Array<FlyType> = [];
    const imitatees: Array<Imitatee> = [];

    for (let i = 0; i < data.types.length; i++) {
        const id = data.types[i];

        const flyType = await flyTypeRepository?.findOne({ externalId: id });
        if (!flyType) {
            throw new ApiException({ message: `Cannot find fly type using ID ${id}` });
        }

        const reference = flyTypeRepository?.getReference(flyType.id);
        if (!reference) {
            throw new ApiException({ message: `Cannot find fly type using ID ${id}` });
        }
        flyTypes.push(reference);
    }

    for (let i = 0; i < data.imitatees.length; i++) {
        const id = data.imitatees[i];
        const imitatee = await imitateeRepository?.findOne({ externalId: id });
        if (!imitatee) {
            throw new ApiException({ message: `Cannot find imitatee using ID ${id}` });
        }
        const reference = imitateeRepository?.getReference(imitatee.id);
        if (!reference) {
            throw new ApiException({ message: `Cannot find imitatee using ID ${id}` });
        }
        imitatees.push(reference);
    }

    fly.types.set(flyTypes);
    fly.imitatees.set(imitatees);

    await em?.flush();

    const { externalId: _externalId, id: _id, ...mappedResult } = fly;
    const response: FlyResourceModel = {
        ...mappedResult,
        id: fly.externalId,
        imitatees: fly.imitatees.toArray().map(mapEntityDbModelToResourceModel),
        types: fly.types.toArray().map(mapEntityDbModelToResourceModel),
    };

    return response;
};

export const deleteFly = async (id: FlyResourceModel['id']): Promise<boolean> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Fly);

    const result = await repository?.nativeDelete({ externalId: id });

    if (result === 0) {
        throw new ApiException({ message: `Cannot find fly using id: ${id}` });
    }

    return true;
};
