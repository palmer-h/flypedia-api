import type { NextFunction, Request, Response } from 'express';
import * as userService from './user.service.js';
import { CreateUserApiResponse } from './user.types.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { FlyResourceModel } from '../fly/fly.types.js';
import ApiException from '../../core/ApiException.js';
import * as flyService from '../fly/fly.service.js';
import { UserRoleName } from '../userRole/userRole.constants.js';

export const createUser = async (
    req: Request,
    res: Response<CreateUserApiResponse>,
    next: NextFunction,
): Promise<void> => {
    try {
        const user = await userService.createUser(req.body.email, req.body.password);
        res.send(user);
    } catch (e) {
        next(e);
    }
};

export const indexFlies = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    const accessTokenUserId = req.body.user.externalId;
    const reqUserId = req.params.id;

    if (!accessTokenUserId || !reqUserId) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    if (accessTokenUserId !== reqUserId && !userService.userHasRole(accessTokenUserId, UserRoleName.ADMIN)) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        const results = await flyService.indexFliesByUserFavourites({
            id: accessTokenUserId,
            pageNumber: Number(req.params.pageNumber),
            pageSize: Number(req.params.pageSize),
        });
        res.send(results);
    } catch (e) {
        next(e);
    }
};

export const addFavouriteFly = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const accessTokenUserId = req.body.user.externalId;
    const reqUserId = req.params.id;

    if (!accessTokenUserId || !reqUserId) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    if (accessTokenUserId !== reqUserId && !userService.userHasRole(accessTokenUserId, UserRoleName.ADMIN)) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        const result = await userService.addFlyToUserFavourites(accessTokenUserId, req.params.flyId);

        if (result) {
            res.send('OK');
        } else {
            const error = new ApiException({
                message: 'Error adding fly to user favourites',
                status: 500,
            });
            return next(error);
        }
    } catch (e) {
        next(e);
    }
};

export const removeFavouriteFly = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const accessTokenUserId = req.body.user.externalId;
    const reqUserId = req.params.id;

    const missingUserIds: boolean = !accessTokenUserId || !reqUserId;
    const hasPermission: boolean = !missingUserIds && accessTokenUserId === reqUserId;

    if (!hasPermission || !userService.userHasRole(accessTokenUserId, UserRoleName.ADMIN)) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        const result = await userService.removeFlyFromUserFavourites(accessTokenUserId, req.params.flyId);

        if (result) {
            res.send('OK');
        } else {
            const error = new ApiException({
                message: 'Error removing fly to user favourites',
                status: 500,
            });
            return next(error);
        }
    } catch (e) {
        next(e);
    }
};
