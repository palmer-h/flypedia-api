import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

const validate = (
    validations: Array<ValidationChain>,
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({
            error: true,
            message: errors.array()[0].msg,
            status: 400,
        });
    };
};

export default validate;
