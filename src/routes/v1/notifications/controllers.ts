import { ObjectType } from 'dynamoose/dist/General';
import ENV from '../../../constants/env';
import { ErrorCode, ErrorMessage } from '../../../constants/errors';
import DB_QUERIES from '../../../db/queries';
import { HttpResponse, INotificationApiModel, INotificationUnseenCount, RequestHandler } from '../../../interfaces/app';
import AVKKONNECT_CORE_SERVICE from '../../../services/avkonnect-core';
import { HttpError } from '../../../utils/error';
import { getUsersInfoKeyValuePair } from '../../../utils/transforms';

export const getUserUnseenNotificationsCount: RequestHandler<{
    Params: { userId: string };
}> = async (request, reply) => {
    const userId = request.params.userId;
    const authUser = request.authUser;
    if (authUser?.id != userId) {
        throw new HttpError(ErrorMessage.AuthorizationError, 403, ErrorCode.AuthorizationError);
    }
    const userInfoResponse = await AVKKONNECT_CORE_SERVICE.getUser(ENV.AUTH_SERVICE_KEY, userId);
    if (!userInfoResponse?.data) {
        throw new HttpError(ErrorMessage.NotFound, 404, ErrorCode.NotFound);
    }
    const response: HttpResponse<INotificationUnseenCount> = {
        success: true,
        data: {
            pendingNotificationCount: userInfoResponse?.data?.unseenNotificationsCount || 0,
        },
    };
    reply.status(200).send(response);
};

export const resetUserUnseenNotificationsCount: RequestHandler<{
    Params: { userId: string };
}> = async (request, reply) => {
    const userId = request.params.userId;
    const authUser = request.authUser;
    if (authUser?.id != userId) {
        throw new HttpError(ErrorMessage.AuthorizationError, 403, ErrorCode.AuthorizationError);
    }
    const userInfoResponse = await AVKKONNECT_CORE_SERVICE.patchUser(ENV.AUTH_SERVICE_KEY, userId, {
        unseenNotificationsCount: 0,
    });
    if (!userInfoResponse?.data) {
        throw new HttpError(ErrorMessage.NotFound, 404, ErrorCode.NotFound);
    }
    const response: HttpResponse<INotificationUnseenCount> = {
        success: true,
        data: {
            pendingNotificationCount: userInfoResponse.data.unseenNotificationsCount || 0,
        },
    };
    reply.status(200).send(response);
};

export const getUserNotifications: RequestHandler<{
    Params: { userId: string };
    Querystring: { limit: number; nextSearchStartFromKey: string };
}> = async (request, reply) => {
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

    const usersInfoData = await AVKKONNECT_CORE_SERVICE.getUsersInfo('', Array.from(relatedUsers));
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

const readNotificationById: RequestHandler<{ Params: { notificationId: string } }> = async (request, reply) => {
    const notificationId = request.params.notificationId;
    const readNotification = await DB_QUERIES.getNotificationsByNotificationId(notificationId);
    const response: HttpResponse<Array<INotificationApiModel>> = {
        success: true,
    };

    if (!readNotification) {
        response.data = readNotification;
        reply.status(404).send(response);
    }
    const updateNotification = await DB_QUERIES.updateNotificationReadStatus(
        readNotification.userId,
        readNotification.createdAt
    );
    if (!updateNotification) {
        response.data = updateNotification;
        reply.status(404).send(response);
    } else {
        reply.status(200).send(response);
    }
};

const NOTIFICATION_CONTROLLER = {
    getUserNotifications,
    readNotificationById,
};

export default NOTIFICATION_CONTROLLER;
