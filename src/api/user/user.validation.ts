import { ValidationChain, body } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';

export const create = <Array<ValidationChain>>[
    commonValidation.email(body('email')),
    commonValidation.password(body('password')),
];
