import { ValidationChain, body, param, query } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';
import { UserRoleName } from '../userRole/userRole.constants.js';

export const create: Array<ValidationChain> = [
    commonValidation.email(body('email')),
    commonValidation.password(body('password')),
    body('role')
        .exists()
        .withMessage('Must provide a role')
        .isIn([UserRoleName.ADMIN, UserRoleName.MAINTAINER, UserRoleName.MEMBER])
        .withMessage('Must be a valid role'),
];

export const indexFlies: Array<ValidationChain> = [
    commonValidation.id(param('id')),
    commonValidation.pageNumber(query('pageNumber')),
    commonValidation.pageSize(query('pageSize')),
];

export const addOrRemoveFly: Array<ValidationChain> = [
    commonValidation.id(param('id')),
    commonValidation.id(param('flyId')),
];
