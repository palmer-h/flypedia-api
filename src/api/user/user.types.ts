import { Fly } from '../fly/fly.entity.js';
import { User } from './user.entity.js';
import { UserRoleName } from '../userRole/userRole.constants.js';

export type CreateUserApiResponse = {
    id: User['externalId'];
    email: User['email'];
    accessToken: string;
    refreshToken: string;
};

export type UserResourceModel = {
    id: string;
    email: string;
    favouriteFlies: Array<Fly>;
};

export type CreateUserBindingModel = {
    email: string;
    password: string;
    role: UserRoleName;
};
