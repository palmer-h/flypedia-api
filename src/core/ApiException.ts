import { ApiExceptionConfig } from './types.js';

export default class ApiException extends Error {
    public status: number;
    public message: string;
    public tokenExpired: boolean;

    constructor(config?: ApiExceptionConfig) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.status = config?.status || 500;
        this.message = config?.message || 'Something went wrong';
        this.tokenExpired = config?.tokenExpired || false;
    }
}
