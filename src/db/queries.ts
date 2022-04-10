import { v4 } from 'uuid';
import Connection, { IConnection } from './models/connection';
import Notifications, { INotification, INotifications } from './models/notifications';

const getConnection = async (connectionId: string): Promise<IConnection> => {
    return Connection.get({ id: connectionId });
};

const getNotificationsByUserId = async (userId: string): Promise<INotifications | undefined> => {
    const notifications = await Notifications.query('userResourceRef').eq(userId).exec();
    return notifications[0];
};

const updateUserNotification = async (
    notificationsId: string,
    updatedNotifications: Array<INotification>
): Promise<INotifications> => {
    return await Notifications.update({ id: notificationsId }, { notifications: updatedNotifications });
};

const createNotifications = async (userId: string): Promise<INotifications> => {
    const notifications: INotifications = {
        id: v4(),
        notifications: [],
        userResourceRef: userId,
    };
    const notificationsObj = new Notifications(notifications);
    await notificationsObj.save();
    return notifications;
};

const DB_QUERIES = {
    getConnection,
    createNotifications,
    getNotificationsByUserId,
    updateUserNotification,
};

export default DB_QUERIES;
