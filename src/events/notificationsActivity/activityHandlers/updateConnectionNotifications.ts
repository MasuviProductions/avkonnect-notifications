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
        console.log('Fetched connection resource', JSON.stringify(connectionResource));

        if (!connectionResource) {
            //handle error
            return;
        }
        const userNotificationBox = await DB_HELPERS.getUserNotificationsForceCreated(connectionResource.connectorId);
        console.log('Fetched user notification resource', JSON.stringify(userNotificationBox));

        const notification: INotification = {
            id: v4(),
            createdAt: Date.now(),
            expiresAt: Math.pow(10, 38) - 1,
            read: false,
            resourceType: connectionActivityType,
            resourceRef: connectionResource.id,
        };
        const updatedUserNotifications = await DB_QUERIES.updateUserNotification(userNotificationBox.id, [
            notification,
            ...userNotificationBox.notifications,
        ]);
        console.log('Updated user notification resource', JSON.stringify(updatedUserNotifications));
    } catch (err: any) {
        console.log(err.message);
    }
    return;
};

export default updateConnectionNotifications;
