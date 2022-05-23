import axios from 'axios';
import API_ENDPOINTS from '../constants/api';
import { IConnectionApiModel } from '../interfaces/api';
import { HttpResponse } from '../interfaces/app';

const getConnection = async (connectionId: string): Promise<HttpResponse<IConnectionApiModel>> => {
    const connection = await axios
        .get<HttpResponse<IConnectionApiModel>>(API_ENDPOINTS.GET_CONNECTION(connectionId))
        .then((res) => res.data)
        .catch((err) => err);
    return connection;
};

const AVKKONNECT_CORE_SERVICE = {
    getConnection,
};

export default AVKKONNECT_CORE_SERVICE;
