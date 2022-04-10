import * as dynamoose from 'dynamoose';
import { TABLE } from '../../constants/db';
import { IActivityType, IDynamooseDocument } from '../../interfaces/app';

export interface INotification {
    id: string;
    createdAt: number;
    read: boolean;
    resourceType: IActivityType;
    resourceRef: string;
    expiresAt: number;
}

const NotificationSchema = new dynamoose.Schema({
    id: { type: String },
    createdAt: { type: Number },
    read: { type: Boolean },
    resourceType: { type: String },
    resourceRef: { type: String },
    expiresAt: { type: Number },
});

export interface INotifications {
    id: string;
    notifications: Array<INotification>;
    userResourceRef: string;
}

const NotificationsSchema = new dynamoose.Schema({
    id: { type: String, hashKey: true },
    notifications: { type: Array, schema: Array.of(NotificationSchema) },
    userResourceRef: {
        type: String,
        index: {
            name: 'userResourceRefIndex',
            global: true,
        },
    },
});

const Notifications = dynamoose.model<IDynamooseDocument<INotifications>>(TABLE.NOTIFICATIONS, NotificationsSchema);

export default Notifications;
