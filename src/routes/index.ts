import { FastifyInstance } from 'fastify';
import initializeNotificationroutes from './v1/notifications';

const initializeRoutes = (fastifyInstance: FastifyInstance) => {
    fastifyInstance.register(initializeNotificationroutes, { prefix: 'api/v1' });
};

export default initializeRoutes;
