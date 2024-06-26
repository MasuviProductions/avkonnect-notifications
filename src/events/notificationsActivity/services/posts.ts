import ENV from '../../../constants/env';
import { INotificationActivity } from '../../../interfaces/app';
import AVKKONNECT_POSTS_SERVICE from '../../../services/avkonnect-posts';
import { createOrUpdateNotificationForResource } from './notifications';

export const postNotificationHandler = async (notificationActivity: INotificationActivity) => {
    const postRes = await AVKKONNECT_POSTS_SERVICE.getPost(ENV.AUTH_SERVICE_KEY, notificationActivity.resourceId);
    if (!postRes.data) {
        throw Error(`Post resource for postId{${notificationActivity.resourceId}} not found`);
    }
    const userId = postRes.data.sourceId;
    await createOrUpdateNotificationForResource(
        userId,
        notificationActivity.resourceId,
        notificationActivity.resourceType,
        notificationActivity.resourceActivity,
        notificationActivity.sourceId,
        notificationActivity.sourceType
    );
};
