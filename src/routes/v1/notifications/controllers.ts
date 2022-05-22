import { FastifyReply, FastifyRequest } from 'fastify';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { AppResponse } from '../../../interfaces/app';

export const getUserNotifications = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
) => {
    const userId = request.params.userId;
    const userNotifications = await DB_QUERIES.getNotificationsByUserId(userId);

    const response: AppResponse<Array<INotification>> = {
        statusCode: 200,
        data: userNotifications || [],
    };
    reply.status(response.statusCode).send(response);
};
