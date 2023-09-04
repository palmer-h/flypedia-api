import { Fly } from './fly.entity.js';

export type FlyResourceModel = Omit<Fly, 'externalId' | 'id'> & { id: string };
