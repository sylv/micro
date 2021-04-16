import { User } from ".prisma/client";
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}
