import { ValidationChain, body } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';

export const authenticate = <Array<ValidationChain>>[
    body('email').exists().withMessage('Must provide an email'),
    body('password').exists().withMessage('Must provide a password'),
];

export const refreshAccessToken = <Array<ValidationChain>>[
    body('userId').exists().withMessage('Must provide a valid user ID'),
    commonValidation.token(body('refreshToken')),
];
