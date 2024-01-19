import { RequestContext } from '@mikro-orm/core';
import { User } from './user.entity.js';
import { UserPermission } from '../userPermission/userPermission.entity.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';
import * as authService from '../auth/auth.service.js';
import ApiException from '../../core/ApiException.js';
import { CreateUserApiResponse, UserResourceModel } from './user.types.js';
import { UserRoleName } from '../userRole/userRole.constants.js';
import { Fly } from '../fly/fly.entity.js';

export const getUser = async (externalId: User['externalId']): Promise<UserResourceModel> => {
    const em = RequestContext.getEntityManager();

    const userRepository = em?.getRepository(User);

    const user = await userRepository?.findOne({ externalId: externalId }, { populate: ['roles', 'favouriteFlies'] });

    if (!user) {
        throw new ApiException({ message: `Cannot find user using id: ${externalId}`, status: 404 });
    }

    return {
        id: user.externalId,
        email: user.email,
        favouriteFlies: user.favouriteFlies.toArray(),
    };
};

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

    const accessToken = authService.createUserAccessToken(newUser.externalId);
    const refreshTokenEntity = authService.createRefreshTokenEntity(newUser.externalId);

    await em?.persist(refreshTokenEntity).flush();

    return {
        id: newUser.externalId,
        email: newUser.email,
        accessToken,
        refreshToken: refreshTokenEntity.token,
    };
};

export const addFlyToUserFavourites = async (
    userExternalId: User['externalId'],
    flyExternalId: Fly['externalId'],
): Promise<boolean> => {
    const em = RequestContext.getEntityManager();

    const userRepository = em?.getRepository(User);
    const flyRepository = em?.getRepository(Fly);

    const user = await userRepository?.findOne({ externalId: userExternalId }, { populate: ['favouriteFlies'] });
    const fly = await flyRepository?.findOne({ externalId: flyExternalId });

    if (!user) {
        throw new ApiException({ message: `Cannot find user using id: ${userExternalId}`, status: 409 });
    }

    if (!fly) {
        throw new ApiException({ message: `Cannot find fly using id: ${flyExternalId}`, status: 409 });
    }

    for (const fly of user.favouriteFlies) {
        if (fly.externalId === flyExternalId) {
            throw new ApiException({ message: `Fly is already in user favourites: ${flyExternalId}`, status: 409 });
        }
    }

    user.favouriteFlies.add(fly);

    await em?.flush();

    return true;
};

export const removeFlyFromUserFavourites = async (
    userExternalId: User['externalId'],
    flyExternalId: Fly['externalId'],
): Promise<boolean> => {
    const em = RequestContext.getEntityManager();

    const userRepository = em?.getRepository(User);

    const user = await userRepository?.findOne({ externalId: userExternalId }, { populate: ['favouriteFlies'] });

    if (!user) {
        throw new ApiException({ message: `Cannot find user using id: ${userExternalId}`, status: 409 });
    }

    let flyToRemove: Fly | undefined = undefined;

    for (const fly of user.favouriteFlies) {
        if (fly.externalId === flyExternalId) {
            flyToRemove = fly;
        }
    }

    if (!flyToRemove) {
        throw new ApiException({ message: `Cannot find fly using id: ${flyExternalId}`, status: 409 });
    }

    user.favouriteFlies.remove(flyToRemove);

    await em?.flush();

    return true;
};

export const userHasPermission = async (
    userId: User['externalId'],
    permissionName: UserPermissionName,
): Promise<boolean> => {
    const em = RequestContext.getEntityManager();

    const userRepository = em?.getRepository(User);
    const permissionRepository = em?.getRepository(UserPermission);

    const user = await userRepository?.findOne({ externalId: userId }, { populate: ['roles'] });
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

export const userHasRole = async (userId: User['externalId'], roleName: UserRoleName): Promise<boolean> => {
    const em = RequestContext.getEntityManager();

    const userRepository = em?.getRepository(User);

    const user = await userRepository?.findOne({ externalId: userId }, { populate: ['roles'] });

    if (!user) {
        throw new ApiException({ message: `Cannot find user using id: ${userId}`, status: 404 });
    }

    if (!user.roles) {
        return false;
    }

    for (const role of user.roles) {
        if (role.name === roleName) {
            return true;
        }
    }

    return false;
};
