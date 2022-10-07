import type { MicroHost } from '../classes/MicroHost.js';
import type { User } from './user/user.entity.js';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    host: MicroHost;
  }
}
