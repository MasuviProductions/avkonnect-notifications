import { fastify } from 'fastify';
import initRouter from './routes';
import initDB from './utils/db/client';

const APP = fastify({
    logger: true,
});

initDB();
initRouter(APP);

export { APP };
export default APP;
