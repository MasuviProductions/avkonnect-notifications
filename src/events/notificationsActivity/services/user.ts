import ENV from '../../../constants/env';
import AVKKONNECT_CORE_SERVICE from '../../../services/avkonnect-core';

export const updateNotificationCountForUser = async (userId: string) => {
    const userInfo = await AVKKONNECT_CORE_SERVICE.getUser(ENV.AUTH_SERVICE_KEY, userId);
    if (!userInfo) {
        throw Error(`User info not found for userId{${userId}} `);
    }
    const updatedUserInfo = await AVKKONNECT_CORE_SERVICE.patchUser(ENV.AUTH_SERVICE_KEY, userId, {
        unseenNotificationsCount: (userInfo.data?.unseenNotificationsCount || 0) + 1,
    });
    if (!updatedUserInfo) {
        throw Error(`User unseenNotificationsCount could not be updated for userId{${userId}} `);
    }
    // eslint-disable-next-line no-console
    console.info(
        `User unseenNotificationsCount for userId{${userId}} is ${updatedUserInfo.data?.unseenNotificationsCount}`
    );
};
