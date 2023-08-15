import { ValidationChain } from 'express-validator';

export const id = (body: ValidationChain, subject?: string): ValidationChain => {
    return body
        .exists()
        .withMessage(`${subject ? subject + ' id' : 'ID'} is required`)
        .trim()
        .isLength({ min: 36, max: 36 })
        .withMessage(`${subject ? subject + ' id' : 'ID'} is invalid`);
};

export const email = (body: ValidationChain): ValidationChain => {
    return body
        .exists()
        .withMessage('Must provide an email')
        .isString()
        .withMessage('Email must be a string')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email');
};

export const password = (body: ValidationChain): ValidationChain => {
    return body
        .exists()
        .withMessage('Must provide a password')
        .isString()
        .withMessage('Password must be a string')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters');
};

export const token = (body: ValidationChain): ValidationChain => {
    return body.exists().withMessage('Token is required').isString().trim();
};

export const name = (body: ValidationChain, subject?: string): ValidationChain => {
    return body
        .exists()
        .withMessage(`${subject ? subject + ' name' : 'Name'} is required`)
        .isString()
        .withMessage(
            `${subject ? subject + ' name' : 'Name'}
            must be a string`,
        )
        .trim()
        .isAlpha('en-GB', { ignore: ' ' })
        .withMessage(
            `${subject ? subject + ' name' : 'Name'}
            must only contain alphabetical characters`,
        )
        .isLength({ min: 3, max: 32 })
        .withMessage(
            `${subject ? subject + ' name' : 'Name'}
            must be between 3 and 32 characters`,
        );
};

export const description = (body: ValidationChain, subject?: string): ValidationChain => {
    return body
        .exists()
        .withMessage(
            `${subject ? subject + ' description' : 'Description'}
            is required`,
        )
        .isString()
        .withMessage(
            `${subject ? subject + ' description' : 'Description'}
            must be a string`,
        )
        .trim()
        .isLength({ min: 10, max: 100 })
        .withMessage(
            `${subject ? subject + ' description' : 'Description'}
            must be between 10 and 100 characters`,
        );
};

export const pageNumber = (query: ValidationChain): ValidationChain => {
    return query
        .exists()
        .withMessage('Page number is required')
        .isNumeric()
        .withMessage('Page number must be numeric')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Page number must be between 1 and 100');
};

export const pageSize = (query: ValidationChain): ValidationChain => {
    return query
        .exists()
        .withMessage('Page size is required')
        .isNumeric()
        .withMessage('Page size must be numeric')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Page size must be between 1 and 100');
};

export const listOfIds = (query: ValidationChain, subject?: string): ValidationChain => {
    return query
        .exists()
        .withMessage(`${subject ? subject + ' ids' : 'Ids'} are required`)
        .isArray()
        .withMessage(`${subject ? subject + ' ids' : 'Ids'} must be an array`);
};
