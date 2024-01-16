import type { NextFunction, Request, Response } from 'express';
import * as userService from './user.service.js';
import { CreateUserApiResponse } from './user.types.js';

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
