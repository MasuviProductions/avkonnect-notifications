import { ObjectType } from 'dynamoose/dist/General';
import { HttpDynamoDBResponsePagination } from '../interfaces/app';
import DB_HELPERS from './helpers';
import Notifications, { INotification } from './models/notifications';

const getNotificationsByUserId = async (
    userId: string,
    limit: number,
    nextSearchStartFromKey?: ObjectType
): Promise<{ documents: Partial<INotification>[]; dDBPagination: HttpDynamoDBResponsePagination }> => {
    const notificationsQuery = Notifications.query('userId').eq(userId);

    const paginatedDocuments = DB_HELPERS.fetchDynamoDBPaginatedDocuments<INotification>(
        notificationsQuery,
        [],
        limit,
        ['userId', 'createdAt'],
        nextSearchStartFromKey
    );
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

const DB_QUERIES = {
    createNotification,
    getNotificationsByUserId,
    updateNotificationReadStatus,
    getNotificationsByNotificationId,
};

export default DB_QUERIES;
