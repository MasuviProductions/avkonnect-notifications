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
        const notificationActivity = JSON.parse(message.body) as INotificationActivity;
        await processNotificationActivity(notificationActivity);
    }
};

export default notificationsActivityHandler;
