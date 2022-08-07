import { ObjectType } from 'dynamoose/dist/General';
import ENV from '../../../constants/env';
import { ErrorCode, ErrorMessage } from '../../../constants/errors';
import DB_QUERIES from '../../../db/queries';
import { notificationEventProcessor } from '../../../events/notificationsActivity/notificationsActivityHandler';
import {
    HttpResponse,
    INotificationActivity,
    INotificationResponse,
    INotificationsResponse,
    INotificationUnseenCountResponse,
    RequestHandler,
} from '../../../interfaces/app';
import AVKKONNECT_CORE_SERVICE from '../../../services/avkonnect-core';
import { HttpError } from '../../../utils/error';

const getUserUnseenNotificationsCount: RequestHandler<{
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
    const response: HttpResponse<INotificationUnseenCountResponse> = {
        success: true,
        data: {
            pendingNotificationCount: userInfoResponse?.data?.unseenNotificationsCount || 0,
        },
    };
    reply.status(200).send(response);
};

const resetUserUnseenNotificationsCount: RequestHandler<{
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
    const response: HttpResponse<INotificationUnseenCountResponse> = {
        success: true,
        data: {
            pendingNotificationCount: userInfoResponse.data.unseenNotificationsCount || 0,
        },
    };
    reply.status(200).send(response);
};

const getUserNotifications: RequestHandler<{
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
        relatedUsers.add(notification.sourceId as string);
    });

    const usersInfoData = await AVKKONNECT_CORE_SERVICE.getUsersInfo('', Array.from(relatedUsers));

    const notificationsInfo: INotificationsResponse = {
        notifications: notificationDocuments,
        relatedSources: [...(usersInfoData.data || [])],
    };

    const response: HttpResponse<INotificationsResponse> = {
        success: true,
        data: notificationsInfo,
        dDBPagination: dDBPagination,
    };
    reply.status(200).send(response);
};

const updateNotificationAsRead: RequestHandler<{ Params: { notificationId: string; userId: string } }> = async (
    request,
    reply
) => {
    const notification = request.params.notificationId;
    const readNotification = await DB_QUERIES.getNotificationsByNotificationId(notification);
    if (!readNotification) {
        throw new HttpError(ErrorMessage.NotFound, 404, ErrorCode.NotFound);
    }
    const updatedNotification = await DB_QUERIES.updateNotificationReadStatus(
        readNotification.userId,
        readNotification.createdAt
    );
    if (!updatedNotification) {
        throw new HttpError(ErrorMessage.ResourceUpdateError, 500, ErrorCode.ResourceUpdateError);
    }
    const response: HttpResponse<INotificationResponse> = {
        success: true,
        data: updatedNotification,
    };
    reply.status(200).send(response);
};

const notificationGenerateSampleEvent: RequestHandler<{ Body: INotificationActivity }> = async (request, reply) => {
    const notificationActivity = request.body;
    await notificationEventProcessor(notificationActivity);
    const response: HttpResponse = {
        success: true,
    };
    reply.status(200).send(response);
};

const NOTIFICATION_CONTROLLER = {
    getUserNotifications,
    updateNotificationAsRead,
    getUserUnseenNotificationsCount,
    resetUserUnseenNotificationsCount,
    notificationGenerateSampleEvent,
};

export default NOTIFICATION_CONTROLLER;
