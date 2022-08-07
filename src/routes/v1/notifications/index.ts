import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { authHandler } from '../../../middlewares/authHandler';
import { userPathValidationHandler } from '../../../middlewares/userPathValidationHandler';
import NOTIFICATION_CONTROLLER from './controllers';

const initializeNotificationRoutes = (
    fastify: FastifyInstance,
    _opts: FastifyRegisterOptions<FastifyPluginOptions>,
    done: () => void
) => {
    fastify.get(
        '/users/:userId/notifications',
        { preHandler: [authHandler, userPathValidationHandler] },
        NOTIFICATION_CONTROLLER.getUserNotifications
    );
    fastify.get(
        '/users/:userId/notifications/unseen',
        { preHandler: [authHandler, userPathValidationHandler] },
        NOTIFICATION_CONTROLLER.getUserUnseenNotificationsCount
    );
    fastify.delete(
        '/users/:userId/notifications/unseen',
        { preHandler: [authHandler, userPathValidationHandler] },
        NOTIFICATION_CONTROLLER.resetUserUnseenNotificationsCount
    );
    fastify.patch(
        '/users/:userId/notifications/:notificationId/read',
        { preHandler: [authHandler, userPathValidationHandler] },
        NOTIFICATION_CONTROLLER.updateNotificationAsRead
    );

    fastify.post('/notificationGenerateSampleEvent', NOTIFICATION_CONTROLLER.notificationGenerateSampleEvent);
    done();
};

export default initializeNotificationRoutes;
