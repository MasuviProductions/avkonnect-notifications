import { FastifyReply, FastifyRequest } from 'fastify';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { HttpResponse } from '../../../interfaces/app';

export const getUserNotifications = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
) => {
    const userId = request.params.userId;
    const userNotifications = await DB_QUERIES.getNotificationsByUserId(userId);

    const response: HttpResponse<Array<INotification>> = {
        success: true,
        data: userNotifications || [],
    };
    reply.status(200).send(response);
};
