import { User } from './user.entity.js';

export type CreateUserApiResponse = { id: User['id']; email: User['email']; accessToken: string; refreshToken: string };
