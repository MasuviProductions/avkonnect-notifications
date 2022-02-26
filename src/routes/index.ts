import { FastifyInstance } from 'fastify';
import initializeBooksRoutes from './v1/books';
import initializeMoviesRoutes from './v1/movies';

const initializeRoutes = (fastifyInstance: FastifyInstance) => {
    fastifyInstance.register(initializeBooksRoutes, { prefix: 'api/v1' });
    fastifyInstance.register(initializeMoviesRoutes, { prefix: 'api/v1' });
};

export default initializeRoutes;
