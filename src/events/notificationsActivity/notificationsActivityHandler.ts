import { INotificationActivity } from '../../interfaces/app';
import { commentNotificationHandler } from './services/comments';
import { connectionNotificationHandler } from './services/connections';
import { postNotificationHandler } from './services/posts';

interface ISQSEventRecord {
    body: string;
}

interface ISQSEvent {
    Records: ISQSEventRecord[];
}
const notificationsActivityHandler = async (event: ISQSEvent) => {
    for (const message of event.Records) {
        try {
            const notificationActivity = JSON.parse(message.body) as INotificationActivity;
            await notificationEventProcessor(notificationActivity);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log('ERROR:', (err as Error).message);
        }
    }
};

export const notificationEventProcessor = async (notificationActivity: INotificationActivity) => {
    switch (notificationActivity.resourceType) {
        case 'connection': {
            await connectionNotificationHandler(notificationActivity);
            return;
        }
        case 'post': {
            await postNotificationHandler(notificationActivity);
            return;
        }
        case 'comment': {
            await commentNotificationHandler(notificationActivity);
        }
    }
};

export default notificationsActivityHandler;
