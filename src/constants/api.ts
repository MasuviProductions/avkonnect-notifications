import ENV from './env';

const AVKONNECT_URL = {
    CORE: ENV.AVKONNECT_CORE_URL,
};

const API_ENDPOINTS = {
    GET_CONNECTION: (connectionId: string): string => `${AVKONNECT_URL.CORE}/connections/${connectionId}`,
};

export default API_ENDPOINTS;
