import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { getUserNotifications } from './controllers';

const initializeMoviesRoutes = (
    fastify: FastifyInstance,
    _opts: FastifyRegisterOptions<FastifyPluginOptions>,
    done: () => void
) => {
    fastify.get('/notifications/users/:userId', getUserNotifications);
    done();
};

export default initializeMoviesRoutes;