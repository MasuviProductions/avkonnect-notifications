import Notifications, { INotification } from './models/notifications';

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
    createNotification,
    getNotificationsByUserId,
};

export default DB_QUERIES;
