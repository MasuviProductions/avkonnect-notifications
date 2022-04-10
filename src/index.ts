import { fastify } from 'fastify';
import initRouter from './routes';
import { initDynamoDB } from './db/client';
import { errorHandler } from './middlewares/errorHandler';

initDynamoDB();

const APP = fastify({
    logger: true,
});

APP.setErrorHandler(errorHandler);

initRouter(APP);

export { APP };
export default APP;
