import { Collection, Entity, ManyToMany, Property, TextType } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseEntity } from '../common/base.entity.js';
import { UserRole } from '../userRole/userRole.entity.js';
import { UserPermissionName } from './userPermission.constants.js';

@Entity({ repository: () => EntityRepository<UserPermission> })
export class UserPermission extends BaseEntity {
    @Property({ type: TextType })
    name: UserPermissionName;

    @ManyToMany(() => UserRole, (userRole) => userRole.permissions)
    roles = new Collection<UserRole>(this);

    constructor(name: UserPermissionName) {
        super();
        this.name = name;
    }
}
