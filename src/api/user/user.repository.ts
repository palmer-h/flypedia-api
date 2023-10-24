import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './user.entity.js';

export class UserRepository extends EntityRepository<User> {
    async exists(email: string): Promise<boolean> {
        const count = await this.qb().where({ email }).getCount();
        console.log(count);
        return count > 0;
    }
}
