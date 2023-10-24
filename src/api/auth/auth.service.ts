import dotenv from 'dotenv';
import { formatISO, addDays } from 'date-fns';
import { RefreshToken } from '../refreshToken/refreshToken.entity.js';

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const ACCESS_TOKEN_EXPIRY: string = '900s';
const REFRESH_TOKEN_EXPIRY: Date = addDays(new Date(), 7);

export const generateBcryptHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const createUserAccessToken = (userId: number): string => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const createRefreshTokenEntity = (userId: number): RefreshToken => {
    return new RefreshToken({
        userId,
        token: _rand64ByteHex(),
        validUntil: formatISO(REFRESH_TOKEN_EXPIRY),
    });
};

const _rand64ByteHex = (): string => {
    return crypto.randomBytes(64).toString('hex');
};
