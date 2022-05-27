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

const createNotification = async (notification: INotification): Promise<INotification> => {
    const notificationsObj = new Notifications(notification);
    await notificationsObj.save();
    return notification;
};

const DB_QUERIES = {
    createNotification,
    getNotificationsByUserId,
};

export default DB_QUERIES;
