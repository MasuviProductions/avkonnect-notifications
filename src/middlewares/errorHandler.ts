import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorCode } from '../constants/errors';
import { HttpResponse } from '../interfaces/app';

export const errorHandler = (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    const response: HttpResponse<string> = {
        success: false,
        error: {
            code: ErrorCode.InternalServerError,
            message: error.message,
        },
    };

    reply.status(500).send(response);
};
