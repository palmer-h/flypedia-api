import { Entity, EntityRepositoryType, Property, TextType } from '@mikro-orm/core';
import { BaseEntity } from '../common/base.entity.js';
import { UserRepository } from './user.repository.js';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
    [EntityRepositoryType]?: UserRepository;

    @Property({ type: TextType })
    email: string;

    @Property({ type: TextType })
    password: string;

    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }
}
