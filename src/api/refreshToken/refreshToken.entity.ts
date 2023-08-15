import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { RefreshTokenRepository } from './refreshToken.repository.js';

@Entity({ repository: () => RefreshTokenRepository })
export class RefreshToken {
    [EntityRepositoryType]?: RefreshTokenRepository;

    @PrimaryKey()
    id!: number;

    @Property()
    token: string;

    @Property()
    userId: number;

    @Property()
    validUntil: string;

    constructor(data: any) {
        this.token = data.token;
        this.userId = data.userId;
        this.validUntil = data.validUntil;
    }
}
