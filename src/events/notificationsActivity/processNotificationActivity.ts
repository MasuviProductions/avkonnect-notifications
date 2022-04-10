import { INotificationActivity } from '../../interfaces/app';
import updateConnectionNotifications from './activityHandlers/updateConnectionNotifications';

const processNotificationActivity = async (notificationActivity: INotificationActivity) => {
    switch (notificationActivity.activityType) {
        case 'connectionRequest': {
            await updateConnectionNotifications(notificationActivity, 'connectionRequest');
            return;
        }
        case 'connectionConfirmation': {
            await updateConnectionNotifications(notificationActivity, 'connectionConfirmation');
            return;
        }
        default: {
            return;
        }
    }
};

export default processNotificationActivity;
