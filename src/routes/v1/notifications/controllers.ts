import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorCode, ErrorMessage } from '../../../constants/errors';
import { INotifications } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { AppResponse } from '../../../interfaces/app';

export const getUserNotifications = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
) => {
    const userId = request.params.userId;
    const userNotifications = await DB_QUERIES.getNotificationsByUserId(userId);

    const response: AppResponse<INotifications> = {
        statusCode: 0,
    };

    if (!userNotifications) {
        response.statusCode = 404;
        response.error = {
            code: ErrorCode.NotFound,
            message: ErrorMessage.NotFound,
        };
    } else {
        response.statusCode = 200;
        response.data = userNotifications;
    }
    reply.status(response.statusCode).send(response);
};
