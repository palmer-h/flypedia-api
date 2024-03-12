import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { RefreshTokenRepository } from './refreshToken.repository.js';
import { CreateRefreshTokenData } from './refreshToken.types.js';

@Entity({ repository: () => RefreshTokenRepository })
export class RefreshToken {
    [EntityRepositoryType]?: RefreshTokenRepository;

    @PrimaryKey()
    id!: number;

    @Property()
    token: string;

    @Property()
    userId: string;

    @Property()
    validUntil: string;

    constructor(data: CreateRefreshTokenData) {
        this.token = data.token;
        this.userId = data.userId;
        this.validUntil = data.validUntil;
    }
}
