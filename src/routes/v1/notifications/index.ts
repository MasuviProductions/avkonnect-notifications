import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { authHandler } from '../../../middlewares/authHandler';
import { userPathValidationHandler } from '../../../middlewares/userPathValidationHandler';
import {
    getUserNotifications,
    getUserUnseenNotificationsCount,
    resetUserUnseenNotificationsCount,
} from './controllers';

const initializeNotificationRoutes = (
    fastify: FastifyInstance,
    _opts: FastifyRegisterOptions<FastifyPluginOptions>,
    done: () => void
) => {
    fastify.get(
        '/users/:userId/notifications',
        { preHandler: [authHandler, userPathValidationHandler] },
        getUserNotifications
    );
    fastify.get(
        '/users/:userId/notifications/unseen',
        { preHandler: [authHandler, userPathValidationHandler] },
        getUserUnseenNotificationsCount
    );
    fastify.delete(
        '/users/:userId/notifications/unseen',
        { preHandler: [authHandler, userPathValidationHandler] },
        resetUserUnseenNotificationsCount
    );
    done();
};

export default initializeNotificationRoutes;
