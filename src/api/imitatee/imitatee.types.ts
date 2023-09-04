import { Imitatee } from './imitatee.entity.js';

export type ImitateeResourceModel = Omit<Imitatee, 'externalId' | 'id'> & { id: string };
