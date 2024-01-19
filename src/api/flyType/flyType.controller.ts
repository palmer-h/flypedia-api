import type { Request, Response, NextFunction } from 'express';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { FlyTypeResourceModel } from './flyType.types.js';
import { FlyResourceModel } from '../fly/fly.types.js';
import { userHasPermission } from '../user/user.service.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';
import * as flyTypeService from './flyType.service.js';

export const indexFlyTypes = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyTypeResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await flyTypeService.indexFlyTypes(Number(req.query.pageNumber), Number(req.query.pageSize));
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const getFlyType = async (
    req: Request,
    res: Response<FlyTypeResourceModel>,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await flyTypeService.getFlyType(req.params.id);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const createFlyType = async (
    req: Request,
    res: Response<FlyTypeResourceModel['id']>,
    next: NextFunction,
): Promise<void> => {
    const userId = req.body.user.externalId;

    const hasPermission = await userHasPermission(userId, UserPermissionName.CREATE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        const externalId: string = await flyTypeService.createFlyType(req.body.name, req.body.description);
        res.json(externalId);
    } catch (e) {
        next(e);
    }
};

export const updateFlyType = async (
    req: Request,
    res: Response<FlyTypeResourceModel>,
    next: NextFunction,
): Promise<void> => {
    const userId = req.body.user.externalId;
    const hasPermission = await userHasPermission(userId, UserPermissionName.CREATE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        const fly = await flyTypeService.updateFlyType(req.body);
        res.json(fly);
    } catch (e) {
        next(e);
    }
};

export const deleteFlyType = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
    const userId = req.body.user.externalId;
    const hasPermission = await userHasPermission(userId, UserPermissionName.DELETE);

    if (!hasPermission) {
        const error = new ApiException({
            message: 'You do not have the correct permissions to perform this action',
            status: 403,
        });
        return next(error);
    }

    try {
        await flyTypeService.deleteFlyType(req.body.id);
        res.json('OK');
    } catch (e) {
        next(e);
    }
};

export const indexFliesByType = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    try {
        const results = await flyTypeService.indexFliesByType({
            id: req.params.id,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        });
        res.send(results);
    } catch (e) {
        next(e);
    }
};
