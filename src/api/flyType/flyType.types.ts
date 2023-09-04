import { FlyType } from './flyType.entity.js';

export type FlyTypeResourceModel = Omit<FlyType, 'externalId' | 'id'> & { id: string };
