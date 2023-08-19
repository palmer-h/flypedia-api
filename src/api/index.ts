import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { router as authRoutes } from './auth/auth.routes.js';
import { router as userRoutes } from './user/user.routes.js';
import { router as flyRoutes } from './fly/fly.routes.js';
import { router as flyTypeRoutes } from './flyType/flyType.routes.js';
import { router as imitateeRoutes } from './imitatee/imitatee.routes.js';
import ApiException from '../core/ApiException.js';
import { ApiErrorResponse } from '../core/types.js';

const router: Router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/flies', flyRoutes);
router.use('/api/v1/fly-types', flyTypeRoutes);
router.use('/api/v1/imitatees', imitateeRoutes);

router.use((_req: Request, res: Response): void => {
    res.status(404);
    res.json({
        error: true,
        message: 'Resource cannot be found',
    });
});

router.use((error: ApiException, _req: Request, res: Response<ApiErrorResponse>, _next: NextFunction): void => {
    const status: number = error.status || 500;
    res.status(status);
    const response = {
        error: true,
        message: error?.message || 'Error',
        status,
    };
    res.json(response);
});

export default router;
