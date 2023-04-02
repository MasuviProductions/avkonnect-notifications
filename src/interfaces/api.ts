import { IRelatedSource, ISourceType } from './app';

export interface IConnectionApiModel {
    id: string;
    connectorId: string;
    connecteeId: string;
    isConnected: boolean;
    connectedAt?: number;
    connectionInitiatedBy: string;
}

export type IUserImageType =
    | 'displayPictureOriginal'
    | 'displayPictureThumbnail'
    | 'displayPictureMax'
    | 'displayPictureStandard'
    | 'backgroundPictureOriginal'
    | 'backgroundPictureThumbnail'
    | 'backgroundPictureMax'
    | 'backgroundPictureStandard';

export interface IImage<T extends string = string> {
    resolution: string;
    url: string;
    type: T;
}

export interface IUserImage {
    mediaUrls: Array<IMediaUrl>;
    mediaStatus: string;
}

type IMediaUrl = IImage<IUserImageType>;

export type IProfilePictureImages = IUserImage;

export type IBackgroundPictureImages = IUserImage;

export interface IUserApiModel {
    id: string;
    aboutUser: string;
    backgroundImageUrl: string;
    connectionCount: number;
    currentPosition: string;
    dateOfBirth?: Date;
    displayPictureUrl: string;
    email: string;
    followerCount: number;
    followeeCount: number;
    headline: string;
    name: string;
    phone: string;
    gender: string;
    location: string;
    projectsRefId: string;
    experiencesRefId: string;
    skillsRefId: string;
    certificationsRefId: string;
    unseenNotificationsCount?: number;
    settingsRefId: string;
    profilePictureImages: IProfilePictureImages;
    backgroundPictureImages: IBackgroundPictureImages;
}

export type IUserApiResponse = IUserApiModel;

export type IPatchUserApiRequest = Pick<IUserApiModel, 'unseenNotificationsCount'>;

export interface IPostsContent {
    text: string;
    createdAt: Date;
    mediaUrls: string[];
}

export interface IPostApiModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    sourceId: string;
    sourceType: ISourceType;
    contents: IPostsContent[];
    hashtags: Array<string>;
    visibleOnlyToConnections: boolean;
    commentsOnlyByConnections: boolean;
}

export interface IPostApiResponse extends IPostApiModel {
    relatedSources: IRelatedSource[];
}

export interface ICommentContent {
    text: string;
    createdAt: Date;
    mediaUrls: string[];
}

export type ICommentResourceType = 'post' | 'comment';

export interface ICommentApiModel {
    sourceId: string;
    sourceType: ISourceType;
    resourceId: string;
    id: string;
    resourceType: ICommentResourceType;
    createdAt: Date;
    contents: ICommentContent[];
}

export interface ICommentApiResponse extends ICommentApiModel {
    relatedSources: IRelatedSource[];
}
