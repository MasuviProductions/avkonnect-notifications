/* eslint-disable no-unused-vars */
export enum ErrorCode {
    AuthenticationError = 'authentication_error',
    AuthorizationError = 'authorization_error',
    NotFound = 'not_found',
    InternalServerError = 'internal_server_error',
}

export enum ErrorMessage {
    AuthenticationError = 'Authentication error',
    AuthorizationError = 'Forbidden',
    NotFound = 'Resource not found',
    InternalServerError = 'Internal Server Error',
}
