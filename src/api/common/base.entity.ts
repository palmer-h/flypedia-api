import { PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
    @PrimaryKey({ hidden: true })
    id!: number;

    @Property()
    @Unique()
    externalId = uuidv4();

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}
