import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorCode } from '../constants/errors';
import { AppResponse } from '../interfaces/app';

export const errorHandler = (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    const response: AppResponse<string> = {
        statusCode: 500,
        error: {
            code: ErrorCode.InternalServerError,
            message: error.message,
        },
    };

    reply.status(response.statusCode).send(response);
};
