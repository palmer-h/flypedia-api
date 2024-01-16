import { RequestContext } from '@mikro-orm/core';
import { User } from './user.entity.js';
import { UserPermission } from '../userPermission/userPermission.entity.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';
import * as authService from '../auth/auth.service.js';
import ApiException from '../../core/ApiException.js';
import { CreateUserApiResponse } from './user.types.js';

export const createUser = async (email: User['email'], password: User['password']): Promise<CreateUserApiResponse> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(User);
    const exists = await repository?.exists(email);

    if (exists) {
        throw new ApiException({
            message: 'A user with that email already exists',
            status: 409,
        });
    }

    const hashedPassword = await authService.generateBcryptHash(password);
    const newUser = new User(email, hashedPassword);

    await em?.persist(newUser).flush();

    const accessToken = authService.createUserAccessToken(newUser.id);
    const refreshTokenEntity = authService.createRefreshTokenEntity(newUser.id);

    await em?.persist(refreshTokenEntity).flush();

    return {
        id: newUser.id,
        email: newUser.email,
        accessToken,
        refreshToken: refreshTokenEntity.token,
    };
};

export const userHasPermission = async (userId: User['id'], permissionName: UserPermissionName): Promise<boolean> => {
    const em = RequestContext.getEntityManager();

    const userRepository = em?.getRepository(User);
    const permissionRepository = em?.getRepository(UserPermission);

    const user = await userRepository?.findOne({ id: userId }, { populate: ['roles'] });
    const permission = await permissionRepository?.findOne({ name: permissionName });

    if (!user?.roles || !permission) {
        return false;
    }

    for (const role of user.roles) {
        await role.permissions.init();
        if (role.permissions.contains(permission)) {
            return true;
        }
    }

    return false;
};
