import ENV from '../../../constants/env';
import { INotificationActivity } from '../../../interfaces/app';
import AVKKONNECT_POSTS_SERVICE from '../../../services/avkonnect-posts';
import { createOrUpdateNotificationForResource } from './notifications';

export const commentNotificationHandler = async (notificationActivity: INotificationActivity) => {
    const commentRes = await AVKKONNECT_POSTS_SERVICE.getComment(ENV.AUTH_SERVICE_KEY, notificationActivity.resourceId);
    if (!commentRes.data) {
        throw Error(`Comment resource for commentId{${notificationActivity.resourceId}} not found`);
    }
    const userId = commentRes.data.sourceId;
    await createOrUpdateNotificationForResource(
        userId,
        notificationActivity.resourceId,
        notificationActivity.resourceType,
        notificationActivity.resourceActivity,
        notificationActivity.sourceId,
        notificationActivity.sourceType
    );
};
