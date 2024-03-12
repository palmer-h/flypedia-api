import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jsonWebToken from 'jsonwebtoken';
import ApiException from '../core/ApiException.js';

dotenv.config();

export default (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const error = new ApiException({ message: 'Invalid access token', status: 401 });

    if (!authHeader?.startsWith('Bearer ')) {
        return next(error);
    }

    const token = authHeader.substring(7, authHeader.length);
    if (!token?.length) {
        next(error);
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return;
    }

    jsonWebToken.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (errors: jsonWebToken.VerifyErrors | null, jwt?: string | jsonWebToken.JwtPayload) => {
            if (errors) {
                const exception = new ApiException({
                    message: 'Error validating access token',
                    tokenExpired: errors.name === 'TokenExpiredError',
                    status: 401,
                });
                next(exception);
            }
            req.body.user = jwt;
            next();
        },
    );
};
