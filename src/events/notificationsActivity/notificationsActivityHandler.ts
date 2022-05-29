import { INotificationActivity } from '../../interfaces/app';
import processNotificationActivity from './processNotificationActivity';

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
            await processNotificationActivity(notificationActivity);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log('ERROR:', (err as Error).message);
        }
    }
};

export default notificationsActivityHandler;
