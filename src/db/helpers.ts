import { INotifications } from './models/notifications';
import DB_QUERIES from './queries';

const getUserNotificationsForceCreated = async (userId: string): Promise<INotifications> => {
    let userNotificationBox = await DB_QUERIES.getNotificationsByUserId(userId);
    // Create user notification box if it does not exist
    if (!userNotificationBox) {
        userNotificationBox = await DB_QUERIES.createNotifications(userId);
    }
    return userNotificationBox;
};

const DB_HELPERS = {
    getUserNotificationsForceCreated,
};

export default DB_HELPERS;
