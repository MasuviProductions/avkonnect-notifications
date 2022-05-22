import Connection, { IConnection } from './models/connection';
import Notifications, { INotification } from './models/notifications';

const getConnection = async (connectionId: string): Promise<IConnection> => {
    return Connection.get({ id: connectionId });
};

const getNotificationsByUserId = async (userId: string): Promise<Array<INotification> | undefined> => {
    const notifications = await Notifications.query('userId').eq(userId).exec();
    return notifications;
};

const createNotification = async (notification: INotification): Promise<INotification> => {
    const notificationsObj = new Notifications(notification);
    await notificationsObj.save();
    return notification;
};

const DB_QUERIES = {
    getConnection,
    createNotification,
    getNotificationsByUserId,
};

export default DB_QUERIES;
