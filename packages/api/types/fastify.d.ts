import "fastify";
import { User } from "../src/types";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      username: string;
    };
  }
}
