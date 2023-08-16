import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { FlyFactory } from './factories/fly.factory.js';
import { FlyTypeFactory } from './factories/flyType.factory.js';
import { ImitateeFactory } from './factories/imitatee.factory.js';

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        new FlyFactory(em)
            .each((fly) => {
                fly.types.set(new FlyTypeFactory(em).make(1));
                fly.imitatees.set(new ImitateeFactory(em).make(1));
            })
            .make(100);
    }
}
