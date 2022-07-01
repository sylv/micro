import type { MicroHost } from '../classes/MicroHost';
import type { User } from './user/user.entity';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    host: MicroHost;
  }
}
