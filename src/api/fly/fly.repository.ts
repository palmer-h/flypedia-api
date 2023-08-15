import { EntityRepository } from '@mikro-orm/postgresql';
import { Fly } from './fly.entity.js';

export class FlyRepository extends EntityRepository<Fly> {
    async exists(name: string): Promise<boolean> {
        const count = await this.qb().where({ name }).getCount();
        return count > 0;
    }
}
