/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 } from 'uuid';
import DB_HELPERS from '../../../db/helpers';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { IConnectionActivityType, INotificationActivity } from '../../../interfaces/app';

const updateConnectionNotifications = async (
    notificationActivity: INotificationActivity,
    connectionActivityType: IConnectionActivityType
) => {
    try {
        const connectionResource = await DB_QUERIES.getConnection(notificationActivity.resourceRefId);
        if (!connectionResource) {
            //handle error
            return;
        }
        const userNotificationBox = await DB_HELPERS.getUserNotificationsForceCreated(connectionResource.connectorId);

        const notification: INotification = {
            id: v4(),
            createdAt: Date.now(),
            expiresAt: Infinity,
            read: false,
            resourceType: connectionActivityType,
            resourceRef: connectionResource.id,
        };
        await DB_QUERIES.updateUserNotification(userNotificationBox.id, [
            notification,
            ...userNotificationBox.notifications,
        ]);
    } catch (err: any) {
        console.log(err.message);
    }
    return;
};

export default updateConnectionNotifications;
