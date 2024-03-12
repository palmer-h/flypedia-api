import { ValidationChain, body, param, query } from 'express-validator';
import * as commonValidation from '../../core/commonValidation.js';

const SUBJECT: string = 'Fly';

export const index = <Array<ValidationChain>>[
    commonValidation.pageNumber(query('pageNumber')),
    commonValidation.pageSize(query('pageSize')),
];

export const get = <Array<ValidationChain>>[commonValidation.id(param('id'), SUBJECT)];

export const create = <Array<ValidationChain>>[
    commonValidation.name(body('name'), SUBJECT),
    commonValidation.description(body('description'), SUBJECT),
    commonValidation.listOfIds(body('types'), 'Fly type'),
    commonValidation.listOfIds(body('imitatees'), 'Imitatee'),
];

export const update = <Array<ValidationChain>>[commonValidation.id(param('id'), SUBJECT), ...create];

export const remove = <Array<ValidationChain>>[commonValidation.id(param('id'))];
