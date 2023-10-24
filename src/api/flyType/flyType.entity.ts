import { Collection, Entity, EntityRepositoryType, ManyToMany, Property, TextType } from '@mikro-orm/core';
import { Fly } from '../fly/fly.entity.js';
import { BaseEntity } from '../common/base.entity.js';
import { FlyTypeRepository } from './flyType.repository.js';

@Entity({ repository: () => FlyTypeRepository })
export class FlyType extends BaseEntity {
    [EntityRepositoryType]?: FlyTypeRepository;

    @Property({ type: TextType })
    name!: string;

    @Property({ type: TextType })
    description?: string;

    @ManyToMany(() => Fly, (fly) => fly.types)
    flies = new Collection<Fly>(this);

    constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }
}
