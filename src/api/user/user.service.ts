import { RequestContext } from '@mikro-orm/core';
import { User } from './user.entity.js';
import { UserPermission } from '../userPermission/userPermission.entity.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';

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
