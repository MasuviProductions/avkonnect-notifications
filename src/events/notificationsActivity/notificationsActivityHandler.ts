import { INotificationActivity } from '../../interfaces/app';
import { connectionNotificationHandler } from './services/connections';

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
        }
    }
};

export default notificationsActivityHandler;
