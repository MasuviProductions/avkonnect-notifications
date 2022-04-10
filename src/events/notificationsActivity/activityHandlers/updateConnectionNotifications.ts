import { v4 } from 'uuid';
import DB_HELPERS from '../../../db/helpers';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { IConnectionActivityType, INotificationActivity } from '../../../interfaces/app';

const updateConnectionNotifications = async (
    notificationActivity: INotificationActivity,
    connectionActivityType: IConnectionActivityType
) => {
    const connectionResource = await DB_QUERIES.getConnection(notificationActivity.resourceRefId);
    // eslint-disable-next-line no-console
    console.info('Connection resource:', JSON.stringify(connectionResource));
    if (!connectionResource) {
        throw Error(`Connection resource ${notificationActivity.resourceRefId} not found`);
    }
    const userNotificationBox = await DB_HELPERS.getUserNotificationsForceCreated(connectionResource.connectorId);
    if (!userNotificationBox) {
        throw Error(`User notifications resource for user ${connectionResource.connectorId} not found`);
    }
    // eslint-disable-next-line no-console
    console.info('User notification resource:', JSON.stringify(userNotificationBox));
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
    if (!updatedUserNotifications) {
        throw Error(`User notifications resource for user ${connectionResource.connectorId} could not be updated`);
    }
    // eslint-disable-next-line no-console
    console.info('Updated user notification resource:', JSON.stringify(updatedUserNotifications));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return;
};

export default updateConnectionNotifications;
