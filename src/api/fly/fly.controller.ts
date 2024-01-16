import type { Request, Response, NextFunction } from 'express';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { FlyResourceModel } from './fly.types.js';
import { userHasPermission } from '../user/user.service.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';
import * as flyService from './fly.service.js';

export const indexFlies = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await flyService.indexFlies(Number(req.query.pageNumber), Number(req.query.pageSize));
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const getFly = async (req: Request, res: Response<FlyResourceModel>, next: NextFunction): Promise<void> => {
    try {
        const result = await flyService.getFly(req.params.id);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const createFly = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const userId = req.body.user.userId;

    const hasPermission = await userHasPermission(userId, UserPermissionName.CREATE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        const externalId: string = await flyService.createFly(req.body);
        res.json(externalId);
    } catch (e) {
        next(e);
    }
};

export const updateFly = async (req: Request, res: Response<FlyResourceModel>, next: NextFunction): Promise<void> => {
    const userId = req.body.user.userId;
    const hasPermission = await userHasPermission(userId, UserPermissionName.CREATE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        const fly = await flyService.updateFly(req.body);
        res.json(fly);
    } catch (e) {
        next(e);
    }
};

export const deleteFly = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const userId = req.body.user.userId;
    const hasPermission = await userHasPermission(userId, UserPermissionName.DELETE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        await flyService.deleteFly(req.body.id);
        res.json('OK');
    } catch (e) {
        next(e);
    }
};
