import { EntityRepository } from '@mikro-orm/postgresql';
import { Imitatee } from './imitatee.entity.js';

export class ImitateeRepository extends EntityRepository<Imitatee> {
    async exists(name: string): Promise<boolean> {
        const count = await this.qb().where({ name }).getCount();
        return count > 0;
    }
}
