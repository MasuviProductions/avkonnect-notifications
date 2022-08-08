import { v4 } from 'uuid';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { IResourceType, IResourceActivity, ISourceType } from '../../../interfaces/app';
import { updateNotificationCountForUser } from './user';

export const createOrUpdateNotificationForResource = async (
    userId: string,
    resourceId: string,
    resourceType: IResourceType,
    resourceActivity: IResourceActivity,
    sourceId: string,
    sourceType: ISourceType
) => {
    const userNotificationForResource = await DB_QUERIES.getNotificationByUserIdAndResource(
        userId,
        resourceId,
        resourceType
    );
    if (userNotificationForResource) {
        const isNotificationRead = userNotificationForResource.read;
        const notificationToUpdate: Partial<INotification> = {
            aggregatorCount: !isNotificationRead ? userNotificationForResource.aggregatorCount + 1 : 1,
            sourceId: sourceId,
            sourceType: sourceType,
            read: false,
        };
        DB_QUERIES.updateNotification(
            userNotificationForResource.userId,
            userNotificationForResource.createdAt,
            notificationToUpdate
        );
        if (isNotificationRead) {
            await updateNotificationCountForUser(userId);
        }
    } else {
        const notification: INotification = {
            id: v4(),
            userId: userId,
            createdAt: new Date(Date.now()),
            expiresAt: new Date(8640000000000000),
            read: false,
            resourceId: resourceId,
            resourceActivity: resourceActivity,
            resourceType: resourceType,
            aggregatorCount: 1,
            sourceId: sourceId,
            sourceType: sourceType,
        };

        const createdNotification = await DB_QUERIES.createNotification(notification);
        if (!createdNotification) {
            throw Error(`Notification for userId{${userId}} could not be created for ${resourceType}Id{${resourceId}}`);
        }
        await updateNotificationCountForUser(userId);
    }
};
