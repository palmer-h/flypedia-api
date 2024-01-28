import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { FlyFactory } from './factories/fly.factory.js';
import { FlyTypeFactory } from './factories/flyType.factory.js';
import { ImitateeFactory } from './factories/imitatee.factory.js';
import { User } from '../api/user/user.entity.js';
import { UserRole } from '../api/userRole/userRole.entity.js';
import { UserRoleName } from '../api/userRole/userRole.constants.js';
import { UserPermission as UserPermissionEntity } from '../api/userPermission/userPermission.entity.js';
import { UserPermissionName } from '../api/userPermission/userPermission.constants.js';
import { Fly } from '../api/fly/fly.entity.js';

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        new FlyFactory(em)
            .each(fly => {
                fly.types.set(new FlyTypeFactory(em).make(1));
                fly.imitatees.set(new ImitateeFactory(em).make(1));
            })
            .make(100);

        const create = new UserPermissionEntity(UserPermissionName.CREATE);
        em.persist(create);

        const remove = new UserPermissionEntity(UserPermissionName.DELETE);
        em.persist(remove);

        const member = new UserRole(UserRoleName.MEMBER);
        em.persist(member);

        const admin = new UserRole(UserRoleName.ADMIN);
        admin.permissions.set([create, remove]);
        em.persist(admin);

        const fly1 = new Fly('My new fly', 'My description');
        const fly2 = new Fly('My new fly 2', 'My description 2');
        em.persist(fly1);
        em.persist(fly2);

        const bob = new User('bobbell@email.com', '$2b$10$xmwNXCPby50VEn6C8gcyaeenV/jH.0Nk9WNBbYqQd3JWtsrIkxhPS');
        bob.roles.set([member]);
        bob.favouriteFlies.set([fly1]);
        em.persist(bob);

        const jeff = new User('jeffjones@email.com', '$2b$10$xmwNXCPby50VEn6C8gcyaeenV/jH.0Nk9WNBbYqQd3JWtsrIkxhPS');
        jeff.roles.set([admin]);
        em.persist(jeff);
    }
}
