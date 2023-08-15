import { Entity, Property, ManyToMany, Collection, TextType, EntityRepositoryType } from '@mikro-orm/core';
import { Fly } from '../fly/fly.entity.js';
import { BaseEntity } from '../common/base.entity.js';
import { ImitateeRepository } from './imitatee.repository.js';

@Entity({ repository: () => ImitateeRepository })
export class Imitatee extends BaseEntity {
    [EntityRepositoryType]?: ImitateeRepository;

    @Property({ type: TextType })
    name!: string;

    @Property({ type: TextType })
    description?: string;

    @ManyToMany({ entity: () => Fly, mappedBy: 'imitatees' })
    flies = new Collection<Fly>(this);

    constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }
}
