import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { getBook, getBooks, patchBook } from './controllers';

const initializeBooksRoutes = (
    fastify: FastifyInstance,
    _opts: FastifyRegisterOptions<FastifyPluginOptions>,
    done: () => void
) => {
    fastify.get('/books', getBooks);
    fastify.get('/books/:id', getBook);
    fastify.patch('/books/:id', patchBook);
    done();
};

export default initializeBooksRoutes;
