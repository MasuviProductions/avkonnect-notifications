import { Document } from 'dynamoose/dist/Document';
import { ObjectType } from 'dynamoose/dist/General';
import {
    RouteHandlerMethod,
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    ContextConfigDefault,
    preHandlerAsyncHookHandler,
    RequestGenericInterface,
} from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';
import { INotification } from '../db/models/notifications';
import { IUserApiModel } from './api';

interface FastifyRouteGenericInterface extends RequestGenericInterface, ReplyGenericInterface {}

export type RequestHandler<Request = unknown> = RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    Request & FastifyRouteGenericInterface,
    ContextConfigDefault
>;

export type PreRequestHandler<Request = unknown> = preHandlerAsyncHookHandler<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    Request & FastifyRouteGenericInterface,
    ContextConfigDefault
>;

export interface HttpResponseError {
    code: string;
    message: string;
}

export interface HttpResponsePagination {
    totalCount: number;
    totalPages: number;
    page: number;
    count: number;
}

export interface HttpDynamoDBResponsePagination {
    nextSearchStartFromKey?: ObjectType;
    count: number;
}

export interface HttpResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: HttpResponseError;
    pagination?: HttpResponsePagination;
    dDBPagination?: HttpDynamoDBResponsePagination;
}

export type IDynamooseDocument<T> = T & Document;

export type IConnectionActivityType = 'connectionRequest' | 'connectionConfirmation';

export type IActivityType = IConnectionActivityType;

export interface INotificationActivity {
    resourceId: string;
    activityType: IActivityType;
}

export interface INotificationApiModel extends Partial<INotification> {
    relatedUsers?: Array<Partial<IUserApiModel>>;
}

export interface INotificationUnseenCount {
    pendingNotificationCount: number;
}
