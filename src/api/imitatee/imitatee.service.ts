import { FilterQuery, FindOptions, RequestContext } from '@mikro-orm/core';
import { Fly } from '../fly/fly.entity.js';
import ApiException from '../../core/ApiException.js';
import { Imitatee } from '../imitatee/imitatee.entity.js';
import type { FlyResourceModel } from '../fly/fly.types.js';
import { mapEntityDbModelToResourceModel } from '../../core/utils.js';
import type { IndexPaginatedEntityResponse, PaginatedEntityMetadata } from '../../core/types.js';
import { ImitateeResourceModel } from './imitatee.types.js';

export const indexImitatees = async (
    pageNumber: PaginatedEntityMetadata['pageNumber'],
    pageSize: PaginatedEntityMetadata['pageSize'],
): Promise<IndexPaginatedEntityResponse<ImitateeResourceModel>> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const findOptions: FindOptions<Imitatee> = {
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        orderBy: { name: 'ASC' },
    };

    const results = await repository?.findAndCount({}, findOptions);

    if (!results) {
        throw new ApiException({ message: 'Unable to fetch imitatees' });
    }

    const imitatees: Array<Imitatee> = results[0];
    const totalItems: number = results[1] || 0;
    const totalPages: number = totalItems <= pageSize ? 1 : Math.ceil(totalItems / pageSize);

    return {
        metadata: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
        },
        results: imitatees.map(x => mapEntityDbModelToResourceModel(x)),
    };
};

export const getImitatee = async (id: ImitateeResourceModel['id']): Promise<ImitateeResourceModel> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);

    const result = await repository?.findOne({ externalId: id }, { populate: ['flies'] });
    if (!result) {
        throw new ApiException({ message: `Cannot find imitatee using id: ${id}`, status: 409 });
    }

    return {
        ...result,
        id: result.externalId,
        flies: result.flies.toArray().map(mapEntityDbModelToResourceModel) as any,
    };
};

export const createImitatee = async (
    name: Imitatee['name'],
    description: Imitatee['description'],
): Promise<ImitateeResourceModel['id']> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);

    const exists = await repository?.exists(name);

    if (exists) {
        throw new ApiException({ message: 'Imitatee name already exists', status: 409 });
    }

    const imitatee = new Imitatee(name, description || '');

    await em?.persist(imitatee).flush();
    return imitatee.externalId;
};

export const updateImitatee = async (data: any): Promise<ImitateeResourceModel> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);

    const imitatee = await repository?.findOne({ externalId: data.id });
    if (!imitatee) {
        throw new ApiException({ message: `Cannot find imitatee using id: ${data.id}`, status: 409 });
    }

    imitatee.name = data.name;
    imitatee.description = data.description;

    await em?.flush();

    return mapEntityDbModelToResourceModel(imitatee);
};

export const deleteImitatee = async (id: ImitateeResourceModel['id']): Promise<boolean> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);

    const result = await repository?.nativeDelete({ externalId: id });
    if (result === 0) {
        throw new ApiException({ message: `Cannot find imitatee using id: ${id}` });
    }

    return true;
};

export const indexFliesByImitatee = async (data: any): Promise<IndexPaginatedEntityResponse<FlyResourceModel>> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(Imitatee);
    const flyRepository = em?.getRepository(Fly);

    const imitatee = await repository?.findOne({ externalId: data.id });

    if (!imitatee) {
        throw new ApiException({ message: `Cannot find imitatee using id: ${data.id}`, status: 409 });
    }

    const filterQuery: FilterQuery<Fly> = { types: imitatee.id };
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

    const mappedResults: Array<FlyResourceModel> = flies.map((x: Fly) => {
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
