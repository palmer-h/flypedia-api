import { EntityRepository } from '@mikro-orm/postgresql';
import { FlyType } from './flyType.entity.js';

export class FlyTypeRepository extends EntityRepository<FlyType> {
    async exists(name: string): Promise<boolean> {
        const count = await this.qb().where({ name }).getCount();
        return count > 0;
    }
}
