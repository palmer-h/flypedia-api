import { RequestContext } from '@mikro-orm/core';
import { User } from './user.entity.js';
import ApiException from '../../core/ApiException.js';
import * as authService from '../auth/auth.service.js';
import { NextFunction, Request, Response } from 'express';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const em = RequestContext.getEntityManager();
    const repository = em?.getRepository(User);
    const exists = await repository?.exists(req.body.email);

    if (exists) {
        const error = new ApiException({
            message: 'A user with that email already exists',
            status: 409,
        });
        return next(error);
    }

    const hashedPassword = await authService.generateBcryptHash(req.body.password);
    const newUser = new User(req.body.email, hashedPassword);

    await em?.persist(newUser).flush();

    const accessToken = authService.createUserAccessToken(newUser.id);
    const refreshTokenEntity = authService.createRefreshTokenEntity(newUser.id);

    await em?.persist(refreshTokenEntity).flush();

    res.json({
        userId: newUser.id,
        email: newUser.email,
        accessToken,
        refreshToken: refreshTokenEntity.token,
    });
};
