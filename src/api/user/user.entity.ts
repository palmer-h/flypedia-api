import { Collection, Entity, EntityRepositoryType, ManyToMany, Property, TextType } from '@mikro-orm/core';
import { BaseEntity } from '../common/base.entity.js';
import { UserRepository } from './user.repository.js';
import { UserRole } from '../userRole/userRole.entity.js';
import { Fly } from '../fly/fly.entity.js';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
    [EntityRepositoryType]?: UserRepository;

    @Property({ type: TextType })
    email: string;

    @Property({ type: TextType })
    password: string;

    @ManyToMany(() => UserRole)
    roles = new Collection<UserRole>(this);

    @ManyToMany(() => Fly)
    favouriteFlies = new Collection<Fly>(this);

    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }
}
