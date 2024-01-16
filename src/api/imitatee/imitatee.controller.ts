import type { Request, Response, NextFunction } from 'express';
import ApiException from '../../core/ApiException.js';
import { IndexPaginatedEntityResponse } from '../../core/types.js';
import { ImitateeResourceModel } from './imitatee.types.js';
import { FlyResourceModel } from '../fly/fly.types.js';
import { userHasPermission } from '../user/user.service.js';
import { UserPermissionName } from '../userPermission/userPermission.constants.js';
import * as imitateeService from './imitatee.service.js';

export const indexImitatees = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<ImitateeResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await imitateeService.indexImitatees(Number(req.query.pageNumber), Number(req.query.pageSize));
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const getImitatee = async (
    req: Request,
    res: Response<ImitateeResourceModel>,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await imitateeService.getImitatee(req.params.id);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const createImitatee = async (
    req: Request,
    res: Response<ImitateeResourceModel['id']>,
    next: NextFunction,
): Promise<void> => {
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
        const externalId: string = await imitateeService.createImitatee(req.body.name, req.body.description);
        res.json(externalId);
    } catch (e) {
        next(e);
    }
};

export const updateImitatee = async (
    req: Request,
    res: Response<ImitateeResourceModel>,
    next: NextFunction,
): Promise<void> => {
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
        const imitatee = await imitateeService.updateImitatee({
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
        });
        res.json(imitatee);
    } catch (e) {
        next(e);
    }
};

export const deleteImitatee = async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
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
        await imitateeService.deleteImitatee(req.params.id);
        res.send('OK');
    } catch (e) {
        next(e);
    }
};

export const indexFliesByImitatee = async (
    req: Request,
    res: Response<IndexPaginatedEntityResponse<FlyResourceModel>>,
    next: NextFunction,
): Promise<void> => {
    try {
        const results = await imitateeService.indexFliesByImitatee({
            id: req.params.id,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        });
        res.send(results);
    } catch (e) {
        next(e);
    }
};
