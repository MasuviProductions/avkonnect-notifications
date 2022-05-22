import { Document } from 'dynamoose/dist/Document';

export interface AppResponseError {
    code: string;
    message: string;
}

export interface AppResponse<T = unknown> {
    statusCode: number;
    data?: T;
    error?: AppResponseError;
}

export type IDynamooseDocument<T> = T & Document;

export type IConnectionActivityType = 'connectionRequest' | 'connectionConfirmation';

export type IActivityType = IConnectionActivityType;

export interface INotificationActivity {
    resourceId: string;
    activityType: IActivityType;
}
