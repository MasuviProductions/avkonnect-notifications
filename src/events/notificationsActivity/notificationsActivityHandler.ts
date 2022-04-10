import { INotificationActivity } from '../../interfaces/app';
import processNotificationActivity from './processNotificationActivity';

interface ISQSEventRecord {
    body: string;
}

interface ISQSEvent {
    records: ISQSEventRecord[];
}
const notificationsActivityHandler = async (event: ISQSEvent) => {
    for (const record of event.records) {
        const notificationActivity = JSON.parse(record.body) as INotificationActivity;
        processNotificationActivity(notificationActivity);
    }
};

export default notificationsActivityHandler;
