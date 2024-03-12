import { EntityRepository } from '@mikro-orm/postgresql';
import { isBefore } from 'date-fns';
import { RefreshToken } from './refreshToken.entity.js';

export class RefreshTokenRepository extends EntityRepository<RefreshToken> {
    async isValid(userId: string, token: string): Promise<boolean> {
        const results = await this.qb().where({ userId, token });

        if (!results?.length) {
            return false;
        }

        return isBefore(new Date(), new Date(results[0].validUntil));
    }
}
