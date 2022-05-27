import { ObjectType } from 'dynamoose/dist/General';
import { FastifyReply, FastifyRequest } from 'fastify';
import DB_QUERIES from '../../../db/queries';
import { HttpResponse, INotificationApiModel } from '../../../interfaces/app';
import AVKKONNECT_CORE_SERVICE from '../../../services/avkonnect-core';
import { getUsersInfoKeyValuePair } from '../../../utils/transforms';

export const getUserNotifications = async (
    request: FastifyRequest<{
        Params: { userId: string };
        Querystring: { limit: number; nextSearchStartFromKey: string };
    }>,
    reply: FastifyReply
) => {
    const userId = request.params.userId;
    const limit = Number(request.query.limit);
    const startFromKey = request.query.nextSearchStartFromKey as string;

    const { documents: notificationDocuments, dDBPagination } = await DB_QUERIES.getNotificationsByUserId(
        userId,
        limit,
        startFromKey ? (JSON.parse(decodeURI(startFromKey)) as ObjectType) : undefined
    );
    const relatedUsers = new Set<string>();

    notificationDocuments.forEach((notification) => {
        notification.relatedUserIds?.forEach((relatedUser) => {
            relatedUsers.add(relatedUser);
        });
    });

    const usersInfoData = await AVKKONNECT_CORE_SERVICE.getUsersInfo(Array.from(relatedUsers));
    const usersInfoKeyValuePair = getUsersInfoKeyValuePair(usersInfoData.data || []);
    const notificationDocumentsWithRelatedUserInfo = notificationDocuments.map((notificationDocument) => {
        const relatedUsers = notificationDocument.relatedUserIds?.map((relatedUserId) => {
            return usersInfoKeyValuePair[relatedUserId];
        });
        const notificationDocumentWithRelatedUserInfo: INotificationApiModel = {
            ...notificationDocument,
            relatedUsers,
        };
        return notificationDocumentWithRelatedUserInfo;
    });

    const response: HttpResponse<Array<INotificationApiModel>> = {
        success: true,
        data: notificationDocumentsWithRelatedUserInfo,
        dDBPagination: dDBPagination,
    };
    reply.status(200).send(response);
};
