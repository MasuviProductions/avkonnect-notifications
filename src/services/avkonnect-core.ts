import axios from 'axios';
import API_ENDPOINTS from '../constants/api';
import { IConnectionApiModel, IUserApiModel } from '../interfaces/api';
import { HttpResponse } from '../interfaces/app';

const getConnection = async (connectionId: string): Promise<HttpResponse<IConnectionApiModel>> => {
    const connection = await axios
        .get<HttpResponse<IConnectionApiModel>>(API_ENDPOINTS.GET_CONNECTION(connectionId))
        .then((res) => res.data)
        .catch((err) => err);
    return connection;
};

const getUsersInfo = async (usersList: Array<string>): Promise<HttpResponse<Array<Partial<IUserApiModel>>>> => {
    const usersInfo = await axios
        .post<HttpResponse<Array<Partial<IUserApiModel>>>>(API_ENDPOINTS.GET_USERS_INFO(), usersList)
        .then((res) => res.data)
        .catch((err) => err);
    return usersInfo;
};

const AVKKONNECT_CORE_SERVICE = {
    getConnection,
    getUsersInfo,
};

export default AVKKONNECT_CORE_SERVICE;
