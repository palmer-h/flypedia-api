import { BaseEntity } from '../api/common/base.entity.js';
import { BaseEntityResourceModel } from '../api/common/base.types.js';

export const mapEntityDbModelToResourceModel = <T extends BaseEntity>(src: T): BaseEntityResourceModel<T> => {
    const { externalId: _externalId, id: _id, ...entityModel } = src;
    return {
        ...entityModel,
        id: src.externalId,
    };
};
