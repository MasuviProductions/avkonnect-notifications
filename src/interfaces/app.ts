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

export type ISourceType = 'user' | 'company';

export type IResourceType = 'post' | 'comment' | 'connection' | 'broadcast';

export type IConnectionActivity = 'connectionRequest' | 'connectionConfirmation';
export type IPostActivity = 'postReaction' | 'postComment' | 'postCreation';
export type ICommentActivity = 'commentReaction' | 'commentComment' | 'commentCreation';

export type IResourceActivity = IConnectionActivity | IPostActivity | ICommentActivity;
export interface INotificationActivity {
    resourceId: string;
    resourceType: IResourceType;
    resourceActivity: IResourceActivity;
    sourceId: string;
    sourceType: ISourceType;
}

export type IRelatedSource = Partial<IUserApiModel>;

export interface INotificationsResponse {
    notifications: Array<Partial<INotification>>;
    relatedSources: Array<IRelatedSource>;
}

export type INotificationResponse = INotification;

export interface INotificationUnseenCountResponse {
    pendingNotificationCount: number;
}
