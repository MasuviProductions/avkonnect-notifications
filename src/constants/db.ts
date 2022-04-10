import ENV from './env';

export const TABLE = {
    NOTIFICATIONS: `avk-${ENV.DEPLOYMENT_ENV}-notifications`,
    CONNECTIONS: `avk-${ENV.DEPLOYMENT_ENV}-connections`,
};
