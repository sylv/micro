import { User } from ".prisma/client";
import { MicroHost } from "../../src/classes/MicroHost";
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
    host: MicroHost;
  }
}
