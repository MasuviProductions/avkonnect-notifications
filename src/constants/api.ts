import ENV from './env';

const AVKONNECT_URL = {
    CORE: ENV.AVKONNECT_CORE_URL,
};

const API_ENDPOINTS = {
    GET_CONNECTION: (connectionId: string): string => `${AVKONNECT_URL.CORE}/api/v1/connections/${connectionId}`,
    GET_USERS_INFO: (): string => `${AVKONNECT_URL.CORE}/api/v1/users/getUsersInfo`,
};

export default API_ENDPOINTS;
