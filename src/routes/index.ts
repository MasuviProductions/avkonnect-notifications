import { FastifyInstance } from 'fastify';
import initializeNotificationRoutes from './v1/notifications';

const initializeRoutes = (fastifyInstance: FastifyInstance) => {
    fastifyInstance.register(initializeNotificationRoutes, { prefix: '/api/notifications/v1/' });
};

export default initializeRoutes;
