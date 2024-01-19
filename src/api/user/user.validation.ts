import { ValidationChain, body, param, query } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';

export const create: Array<ValidationChain> = [
    commonValidation.email(body('email')),
    commonValidation.password(body('password')),
];

export const indexFlies: Array<ValidationChain> = [
    commonValidation.id(param('id')),
    commonValidation.pageNumber(query('pageNumber')),
    commonValidation.pageSize(query('pageSize')),
];

export const getFly: Array<ValidationChain> = [commonValidation.id(param('id')), commonValidation.id(param('flyId'))];

export const deleteFly: Array<ValidationChain> = [
    commonValidation.id(param('id')),
    commonValidation.id(param('flyId')),
];
