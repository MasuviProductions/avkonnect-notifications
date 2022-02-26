import serverless, { Application } from 'serverless-http';
import { APP } from '.';

module.exports.handler = serverless(APP as Application);
