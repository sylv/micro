import { MicroHost } from "../classes/MicroHost";
import { User } from "./user/user.entity";
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
    host: MicroHost;
  }
}
