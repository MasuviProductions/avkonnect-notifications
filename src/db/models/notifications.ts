import * as dynamoose from 'dynamoose';
import { TABLE } from '../../constants/db';
import { IActivityType, IDynamooseDocument } from '../../interfaces/app';

export interface INotification {
    id: string;
    userId: string;
    createdAt: number;
    read: boolean;
    resourceType: IActivityType;
    resourceId: string;
    expiresAt: number;
    relatedUserIds: Array<string>;
}

const NotificationsSchema = new dynamoose.Schema({
    id: {
        type: String,
        index: {
            name: 'notificationIdIndex',
            global: true,
        },
    },
    userId: { type: String, hashKey: true },
    createdAt: { type: Date, rangeKey: true },
    read: { type: Boolean },
    resourceType: { type: String },
    resourceId: { type: String },
    expiresAt: { type: Date },
    relatedUserIds: { type: Array, schema: Array.of(String) },
});

const Notifications = dynamoose.model<IDynamooseDocument<INotification>>(TABLE.NOTIFICATIONS, NotificationsSchema);

export default Notifications;
