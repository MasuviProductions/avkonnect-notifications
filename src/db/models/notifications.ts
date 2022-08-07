import * as dynamoose from 'dynamoose';
import { TABLE } from '../../constants/db';
import { IDynamooseDocument, IResourceActivity, IResourceType, ISourceType } from '../../interfaces/app';

export interface INotification {
    id: string;
    userId: string;
    createdAt: Date;
    read: boolean;
    resourceId: string;
    resourceActivity: IResourceActivity;
    resourceType: IResourceType;
    aggregatorCount: number;
    expiresAt: Date;
    sourceId: string;
    sourceType: ISourceType;
}

const NotificationsSchema = new dynamoose.Schema({
    id: {
        type: String,
        index: {
            name: 'notificationIdIndex',
            global: true,
        },
    },
    sourceId: { type: String },
    sourceType: { type: String },
    userId: { type: String, hashKey: true },
    createdAt: { type: Date, rangeKey: true },
    read: { type: Boolean },
    resourceId: {
        type: String,
        index: { global: true, name: 'resourceIndex', rangeKey: 'resourceType', project: true },
    },
    resourceType: { type: String },
    resourceActivity: { type: String },
    aggregatorCount: { type: Number },
    expiresAt: { type: Date },
    relatedUserIds: { type: Array, schema: Array.of(String) },
});

const Notifications = dynamoose.model<IDynamooseDocument<INotification>>(TABLE.NOTIFICATIONS, NotificationsSchema);

export default Notifications;
