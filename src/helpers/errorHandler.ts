import { InternalServerErrorException, Logger } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { RenderableReply } from "../types";

const logger = new Logger("ErrorHandler");
export const nestErrorHandler = async (err: any, request: FastifyRequest, reply: RenderableReply) => {
  if (request.url.startsWith("/api")) {
    const wrapped = err.response ? err : new InternalServerErrorException(err.message);
    if (wrapped.status >= 500) logger.error(err.message, err.stack);
    return reply.status(wrapped.status).send(wrapped.response);
  }

  if (err.status === 404) {
    return reply.render("404");
  }

  // fall through to nest-next handler
};
