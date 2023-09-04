import { ValidationChain, body, param, query } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';

const subject: string = 'Fly type';

export const get = <Array<ValidationChain>>[commonValidation.id(param('id'), subject)];

export const create = <Array<ValidationChain>>[commonValidation.name(body('name'), subject)];

export const update = <Array<ValidationChain>>[
    commonValidation.id(param('id'), subject),
    commonValidation.name(body('name'), subject),
];

export const remove = <Array<ValidationChain>>[commonValidation.id(param('id'))];

export const indexFlies = <Array<ValidationChain>>[
    commonValidation.id(param('id')),
    commonValidation.pageNumber(query('pageNumber')),
    commonValidation.pageSize(query('pageSize')),
];
