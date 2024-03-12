import { Entity, Property, ManyToMany, Collection, TextType, EntityRepositoryType } from '@mikro-orm/core';
import { FlyType } from '../flyType/flyType.entity.js';
import { Imitatee } from '../imitatee/imitatee.entity.js';
import { BaseEntity } from '../common/base.entity.js';
import { FlyRepository } from './fly.repository.js';
import { User } from '../user/user.entity.js';

@Entity({ repository: () => FlyRepository })
export class Fly extends BaseEntity {
    [EntityRepositoryType]?: FlyRepository;

    @Property({ type: TextType })
    name!: string;

    @Property({ type: TextType })
    description?: string;

    @ManyToMany(() => FlyType)
    types = new Collection<FlyType>(this);

    @ManyToMany({ entity: () => Imitatee, inversedBy: 'flies' })
    imitatees = new Collection<Imitatee>(this);

    @ManyToMany(() => User, (user) => user.favouriteFlies)
    users = new Collection<User>(this);

    constructor(name: string, description?: string) {
        super();
        this.name = name;
        this.description = description;
    }
}
