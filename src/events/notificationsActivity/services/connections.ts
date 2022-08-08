import { v4 } from 'uuid';
import ENV from '../../../constants/env';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { INotificationActivity, IConnectionActivity } from '../../../interfaces/app';
import AVKKONNECT_CORE_SERVICE from '../../../services/avkonnect-core';
import { updateNotificationCountForUser } from './user';

export const connectionNotificationHandler = async (notificationActivity: INotificationActivity) => {
    switch (notificationActivity.resourceActivity) {
        case 'connectionRequest': {
            await updateConnectionNotifications(notificationActivity, 'connectionRequest');
            return;
        }
        case 'connectionConfirmation': {
            await updateConnectionNotifications(notificationActivity, 'connectionConfirmation');
            return;
        }
        default: {
            return;
        }
    }
};

export const updateConnectionNotifications = async (
    notificationActivity: INotificationActivity,
    connectionActivity: IConnectionActivity
) => {
    const connectionResourceData = await AVKKONNECT_CORE_SERVICE.getConnection(
        ENV.AUTH_SERVICE_KEY,
        notificationActivity.resourceId
    );
    const connectionResource = connectionResourceData?.data;

    if (!connectionResource) {
        throw Error(`Connection resource for connectionId{${notificationActivity.resourceId}} not found`);
    }
    // eslint-disable-next-line no-console
    console.info(
        `Connection resource for connectionId{${notificationActivity.resourceId}}:`,
        JSON.stringify(connectionResource)
    );

    const notification: INotification = {
        id: v4(),
        userId: connectionResource.connectorId,
        createdAt: new Date(Date.now()),
        expiresAt: new Date(8640000000000000),
        read: false,
        resourceId: connectionResource.id,
        resourceActivity: connectionActivity,
        resourceType: 'connection',
        aggregatorCount: 0,
        sourceId: connectionResource.connecteeId,
        sourceType: 'user',
    };
    const userConnectionNotification = await DB_QUERIES.createNotification(notification);
    if (!userConnectionNotification) {
        throw Error(
            `Connection request notifications for userId{${connectionResource.connectorId}} from userId{${connectionResource.connecteeId}} could not be created`
        );
    }
    // eslint-disable-next-line no-console
    console.info(
        `Connection request notifications for userId{${connectionResource.connectorId}} from userId{${connectionResource.connecteeId}}:`,
        JSON.stringify(userConnectionNotification)
    );
    await updateNotificationCountForUser(connectionResource.connectorId);

    return;
};

export default updateConnectionNotifications;
