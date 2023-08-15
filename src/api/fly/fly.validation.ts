import { ValidationChain, body, param, query } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';

const subject: string = 'Fly';

export const index = <Array<ValidationChain>>[
    commonValidation.pageNumber(query('pageNumber')),
    commonValidation.pageSize(query('pageSize')),
];

export const get = <Array<ValidationChain>>[commonValidation.id(param('id'), subject)];

export const create = <Array<ValidationChain>>[
    commonValidation.name(body('name'), subject),
    commonValidation.description(body('description'), subject),
    commonValidation.listOfIds(body('types'), 'Fly type'),
    commonValidation.listOfIds(body('imitatees'), 'Imitatee'),
];

export const update = <Array<ValidationChain>>[commonValidation.id(param('id'), subject), ...create];

export const remove = <Array<ValidationChain>>[commonValidation.id(param('id'))];
