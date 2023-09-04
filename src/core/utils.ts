/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseEntity } from '../api/common/base.entity.js';
import { BaseEntityResourceModel } from './types.js';

export const mapEntityDbModelToResourceModel = <T extends BaseEntity>(src: T): BaseEntityResourceModel<T> => {
    const { externalId, id, ...entityModel } = src;
    return {
        ...entityModel,
        id: src.externalId,
    };
};
