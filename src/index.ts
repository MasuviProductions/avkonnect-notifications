import { fastify } from 'fastify';
import fastifyCors from '@fastify/cors';
import initializeRoutes from './routes';
import { initDynamoDB } from './db/client';
import { errorHandler } from './middlewares/errorHandler';

initDynamoDB();

const APP = fastify({
    logger: true,
});

APP.register(fastifyCors);

APP.setErrorHandler(errorHandler);

initializeRoutes(APP);

export { APP };
export default APP;
