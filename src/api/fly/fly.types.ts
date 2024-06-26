import { BaseEntityResourceModel } from '../../api/common/base.types.js';
import { Fly } from './fly.entity.js';
import { EntityDTO } from '@mikro-orm/core';
import { Imitatee } from '../imitatee/imitatee.entity.js';
import { FlyType } from '../flyType/flyType.entity.js';

export type FlyResourceModel = Omit<Fly, 'externalId' | 'id' | 'imitatees' | 'types' | 'users'> & {
    id: string;
    types: Array<BaseEntityResourceModel<EntityDTO<FlyType>>>;
    imitatees: Array<BaseEntityResourceModel<EntityDTO<Imitatee>>>;
};

export type FlyBindingModel = {
    id: string;
    name: string;
    description: string;
    types: Array<string>;
    imitatees: Array<string>;
};
