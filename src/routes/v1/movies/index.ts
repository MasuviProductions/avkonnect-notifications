import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { getMovie, getMovies } from './controllers';

const initializeMoviesRoutes = (
    fastify: FastifyInstance,
    _opts: FastifyRegisterOptions<FastifyPluginOptions>,
    done: () => void
) => {
    fastify.get('/movies', getMovies);
    fastify.get('/movies/:id', getMovie);
    done();
};

export default initializeMoviesRoutes;
