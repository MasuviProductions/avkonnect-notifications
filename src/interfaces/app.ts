export interface AppResponseError {
    code: string;
    message: string;
}

export interface AppResponse<T = unknown> {
    statusCode: number;
    data?: T;
    error?: AppResponseError;
}

export interface IBook {
    id: string;
    title: string;
    author: string;
}

export interface IMovie {
    id: string;
    title: string;
    director: string;
}
