import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions, RouteHandler } from 'fastify';
import { authHandler } from '../../../middlewares/authHandler';
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
    fastify.get('/notifications/users/:userId', { preHandler: [authHandler] }, getUserNotifications as RouteHandler);
    fastify.get(
        '/notifications/users/:userId/unseen',
        { preHandler: [authHandler] },
        getUserUnseenNotificationsCount as RouteHandler
    );
    fastify.delete(
        '/notifications/users/:userId/unseen',
        { preHandler: [authHandler] },
        resetUserUnseenNotificationsCount as RouteHandler
    );
    done();
};

export default initializeNotificationRoutes;
