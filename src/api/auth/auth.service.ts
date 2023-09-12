import dotenv from 'dotenv';
import { formatISO, addDays } from 'date-fns';
import { RefreshToken } from '../refreshToken/refreshToken.entity.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY_SECONDS, REFRESH_TOKEN_EXPIRY_DAYS } from '../../core/constants.js';

dotenv.config();

export const generateBcryptHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> =>
    await bcrypt.compare(password, hash);

export const createUserAccessToken = (userId: number): string =>
    jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: `${ACCESS_TOKEN_EXPIRY_SECONDS}s`,
    });

export const createRefreshTokenEntity = (userId: number): RefreshToken =>
    new RefreshToken({
        userId,
        token: _rand64ByteHex(),
        validUntil: formatISO(addDays(new Date(), REFRESH_TOKEN_EXPIRY_DAYS)),
    });

const _rand64ByteHex = (): string => crypto.randomBytes(64).toString('hex');
