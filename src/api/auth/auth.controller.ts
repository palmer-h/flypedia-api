import type { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { User } from '../user/user.entity.js';
import ApiException from '../../core/ApiException.js';
import * as authService from '../auth/auth.service.js';
import { RefreshToken } from '../refreshToken/refreshToken.entity.js';
import { DEFAULT_AUTHENTICATE_ERROR_MSG } from './auth.constants.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const userRepository = em?.getRepository(User);
    const user = await userRepository?.findOne({ email: req.body.email }, { populate: ['favouriteFlies'] });

    if (!user) {
        const error = new ApiException({ message: DEFAULT_AUTHENTICATE_ERROR_MSG, status: 401 });
        return next(error);
    }

    const hash = user.password;
    const isValidPassword = await authService.verifyPassword(req.body.password, hash);

    if (!isValidPassword) {
        const error = new ApiException({ message: DEFAULT_AUTHENTICATE_ERROR_MSG, status: 401 });
        return next(error);
    }

    const accessToken: string = authService.signJwt(user.externalId);

    const refreshToken: RefreshToken = authService.createRefreshTokenEntity(user.externalId);

    await em?.persist(refreshToken).flush();

    res.json({
        userId: user.externalId,
        accessToken,
        email: user.email,
        refreshToken: refreshToken.token,
        favouriteFlies: user.favouriteFlies.toArray().map(x => x.externalId),
    });
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const userRepository = em?.getRepository(User);
    const refreshTokenRepository = em?.getRepository(RefreshToken);

    const user = await userRepository?.findOne({ externalId: req.body.userId });
    const isValidRefreshToken = await refreshTokenRepository?.isValid(req.body.userId, req.body.refreshToken);

    if (!user || !isValidRefreshToken) {
        const error = new ApiException({ message: DEFAULT_AUTHENTICATE_ERROR_MSG, status: 401 });
        return next(error);
    }

    await refreshTokenRepository?.nativeDelete({
        token: req.body.refreshToken,
        userId: req.body.userId,
    });

    const accessToken = authService.signJwt(user.externalId);

    const refreshToken = authService.createRefreshTokenEntity(user.externalId);
    await em?.persist(refreshToken).flush();

    res.json({
        refreshToken: refreshToken.token,
        accessToken: accessToken,
    });
};
