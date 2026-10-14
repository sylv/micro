import type { MicroHost } from './config.js';
import type { UserEntity } from './modules/user/user.entity.js';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: UserEntity;
    microHost: MicroHost | null;
  }
}
