import { Collection, Entity, ManyToMany, Property, TextType } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseEntity } from '../common/base.entity.js';
import { User } from '../user/user.entity.js';
import { UserPermission } from '../userPermission/userPermission.entity.js';
import { UserRoleName } from './userRole.constants.js';

@Entity({ repository: () => EntityRepository<UserRole> })
export class UserRole extends BaseEntity {
    @Property({ type: TextType })
    name: UserRoleName;

    @ManyToMany(() => User, (user) => user.roles)
    users = new Collection<User>(this);

    @ManyToMany(() => UserPermission)
    permissions = new Collection<UserPermission>(this);

    constructor(name: UserRoleName) {
        super();
        this.name = name;
    }
}
