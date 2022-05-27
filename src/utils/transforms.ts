import { IUserApiModel } from '../interfaces/api';

export const getUsersInfoKeyValuePair = (
    usersInfo: Array<Partial<IUserApiModel>>
): Record<string, Partial<IUserApiModel>> => {
    const usersInfoKeyValuePair: Record<string, Partial<IUserApiModel>> = {};
    usersInfo.forEach((userInfo) => {
        usersInfoKeyValuePair[userInfo.id as string] = userInfo;
    });
    return usersInfoKeyValuePair;
};
