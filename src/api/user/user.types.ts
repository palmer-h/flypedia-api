import { EntityDTO } from '@mikro-orm/core';
import { Fly } from '../fly/fly.entity.js';
import { User } from './user.entity.js';

export type CreateUserApiResponse = {
    id: User['externalId'];
    email: User['email'];
    accessToken: string;
    refreshToken: string;
};

export type UserResourceModel = {
    id: string;
    email: string;
    favouriteFlies: Array<EntityDTO<Fly>>;
};
