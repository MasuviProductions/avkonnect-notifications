import { v4 } from 'uuid';
import ENV from '../../../constants/env';
import { INotification } from '../../../db/models/notifications';
import DB_QUERIES from '../../../db/queries';
import { IConnectionActivityType, INotificationActivity } from '../../../interfaces/app';
import AVKKONNECT_CORE_SERVICE from '../../../services/avkonnect-core';

const updateConnectionNotifications = async (
    notificationActivity: INotificationActivity,
    connectionActivityType: IConnectionActivityType
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
    const userInfo = await AVKKONNECT_CORE_SERVICE.getUser(ENV.AUTH_SERVICE_KEY, connectionResource.connectorId);
    if (!userInfo) {
        throw Error(`User info not found for userId{${connectionResource.connectorId}} `);
    }
    const updatedUserInfo = await AVKKONNECT_CORE_SERVICE.patchUser(
        ENV.AUTH_SERVICE_KEY,
        connectionResource.connectorId,
        {
            unseenNotificationsCount: (userInfo.data?.unseenNotificationsCount || 0) + 1,
        }
    );
    if (!updatedUserInfo) {
        throw Error(
            `User unseenNotificationsCount could not be updated for userId{${connectionResource.connectorId}} `
        );
    }
    // eslint-disable-next-line no-console
    console.info(
        `User unseenNotificationsCount for userId{${connectionResource.connectorId}} is ${updatedUserInfo.data?.unseenNotificationsCount}`,
        JSON.stringify(userConnectionNotification)
    );

    return;
};

export default updateConnectionNotifications;
