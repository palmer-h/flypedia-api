import type { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { User } from '../user/user.entity.js';
import ApiException from '../../core/ApiException.js';
import * as authService from '../auth/auth.service.js';
import { RefreshToken } from '../refreshToken/refreshToken.entity.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const userRepository = em?.getRepository(User);
    const user = await userRepository?.findOne({ email: req.body.email });

    if (!user) {
        const error = new ApiException({ message: 'Unable to authenticate', status: 401 });
        return next(error);
    }

    const hash = user.password;
    const isValidPassword = await authService.verifyPassword(req.body.password, hash);

    if (!isValidPassword) {
        const error = new ApiException({ message: 'Unable to authenticate user', status: 401 });
        return next(error);
    }

    const accessToken = authService.createUserAccessToken(user.id);
    const refreshToken = authService.createRefreshTokenEntity(user.id);

    await em?.persist(refreshToken).flush();

    res.json({
        userId: user.id,
        accessToken,
        email: user.email,
        refreshToken: refreshToken.token,
    });
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const userRepository = em?.getRepository(User);
    const refreshTokenRepository = em?.getRepository(RefreshToken);
    const user = await userRepository?.findOne({ email: req.body.email });
    const isValidRefreshToken = await refreshTokenRepository?.isValid(req.body.userId, req.body.refreshToken);

    if (!user || !isValidRefreshToken) {
        const error = new ApiException({ message: 'Unable to authenticate user', status: 401 });
        return next(error);
    }

    await refreshTokenRepository?.nativeDelete({
        token: req.body.refreshToken,
        userId: req.body.userId,
    });

    const refreshToken = authService.createRefreshTokenEntity(user.id);

    await em?.persist(refreshToken).flush();

    const accessToken = authService.createUserAccessToken(user.id);

    res.json({
        refreshToken: refreshToken.token,
        accessToken: accessToken,
    });
};
