import { ValidationChain, body, param, query } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';

const SUBJECT: string = 'Imitatee';

export const index = <Array<ValidationChain>>[
    commonValidation.pageNumber(query('pageNumber')),
    commonValidation.pageSize(query('pageSize')),
];

export const get = <Array<ValidationChain>>[commonValidation.id(param('id'), SUBJECT)];

export const create = <Array<ValidationChain>>[commonValidation.name(body('name'), SUBJECT)];

export const update = <Array<ValidationChain>>[
    commonValidation.id(param('id'), SUBJECT),
    commonValidation.name(body('name'), SUBJECT),
];

export const remove = <Array<ValidationChain>>[commonValidation.id(param('id'))];

export const indexFlies = <Array<ValidationChain>>[
    commonValidation.id(param('id')),
    commonValidation.pageNumber(query('pageNumber')),
    commonValidation.pageSize(query('pageSize')),
];
