export type PaginatedEntityMetadata = {
    pageSize: number;
    pageNumber: number;
    totalItems: number;
    totalPages: number;
};

export type IndexPaginatedEntityResponse<T> = {
    results: Array<T>;
    metadata: PaginatedEntityMetadata;
};

export type ApiExceptionConfig = {
    message: string;
    status?: number;
    tokenExpired?: boolean;
};

export type ApiErrorResponse = {
    error: boolean;
    message: string;
    status: number;
};
