import { ObjectType } from 'dynamoose/dist/General';
import { HttpDynamoDBResponsePagination, IResourceType } from '../interfaces/app';
import DB_HELPERS from './helpers';
import Notifications, { INotification } from './models/notifications';

const getNotificationsByUserId = async (
    userId: string,
    limit: number,
    nextSearchStartFromKey?: ObjectType
): Promise<{ documents: Partial<INotification>[]; dDBPagination: HttpDynamoDBResponsePagination }> => {
    const notificationsQuery = Notifications.query('userId').eq(userId).sort('descending');

    const paginatedDocuments = await DB_HELPERS.fetchDynamoDBPaginatedDocuments<INotification>(
        notificationsQuery,
        [],
        limit,
        ['userId', 'createdAt'],
        nextSearchStartFromKey
    );

    if (paginatedDocuments.dDBPagination.nextSearchStartFromKey) {
        paginatedDocuments.dDBPagination.nextSearchStartFromKey.createdAt = (
            paginatedDocuments.dDBPagination.nextSearchStartFromKey.createdAt as Date
        ).getTime();
    }
    return paginatedDocuments;
};

const getNotificationsByNotificationId = async (notificationId: string): Promise<INotification> => {
    const notification = await Notifications.query('id').eq(notificationId).using('notificationIdIndex').exec();
    return notification[0];
};

const createNotification = async (notification: INotification): Promise<INotification> => {
    const notificationsObj = new Notifications(notification);
    await notificationsObj.save();
    return notification;
};

const updateNotificationReadStatus = async (userId: string, createdAt: Date): Promise<INotification> => {
    const updated = await Notifications.update({ userId: userId, createdAt: createdAt.getTime() }, { read: true });
    return updated;
};

const getNotificationByUserIdAndResource = async (userId: string, resourceId: string, resourceType: IResourceType) => {
    const notification = await Notifications.query('userId')
        .eq(userId)
        .and()
        .where('resourceId')
        .eq(resourceId)
        .and()
        .where('resourceType')
        .eq(resourceType)
        .exec();
    return notification[0];
};

const updateNotification = async (
    userId: string,
    createdAt: Date,
    notification: Partial<INotification>
): Promise<INotification> => {
    const updatedNotification = await Notifications.update(
        { userId: userId, createdAt: createdAt.getTime() },
        notification
    );
    return updatedNotification;
};

const DB_QUERIES = {
    createNotification,
    getNotificationsByUserId,
    updateNotificationReadStatus,
    getNotificationsByNotificationId,
    getNotificationByUserIdAndResource,
    updateNotification,
};

export default DB_QUERIES;
