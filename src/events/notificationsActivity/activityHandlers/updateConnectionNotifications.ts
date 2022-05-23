import { v4 } from 'uuid';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { IConnectionActivityType, INotificationActivity } from '../../../interfaces/app';
import AVKKONNECT_CORE_SERVICE from '../../../services/avkonnect-core';

const updateConnectionNotifications = async (
    notificationActivity: INotificationActivity,
    connectionActivityType: IConnectionActivityType
) => {
    const connectionResourceData = await AVKKONNECT_CORE_SERVICE.getConnection(notificationActivity.resourceId);
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
        userId: connectionResource.connectorId,
        id: v4(),
        createdAt: new Date(Date.now()),
        expiresAt: new Date(8640000000000000),
        read: false,
        resourceType: connectionActivityType,
        resourceId: connectionResource.id,
        relatedUserIds: [connectionResource.connecteeId],
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
    return;
};

export default updateConnectionNotifications;
