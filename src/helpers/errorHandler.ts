import { HttpException, HttpStatus, InternalServerErrorException, Logger } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { RenderableReply } from "../types";

const logger = new Logger("ErrorHandler");
export const errorHandler = async (err: any, request: FastifyRequest, reply: RenderableReply) => {
  const wrapped = err instanceof HttpException ? err : new InternalServerErrorException(err.message);
  const response = wrapped.getResponse() as any;
  const status = wrapped.getStatus();
  if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
    logger.error(err.message, err.stack);
  }

  if (request.url.startsWith("/api")) {
    return reply.status(status).send(response);
  }

  if (status !== HttpStatus.NOT_FOUND) {
    return reply.render("_error", {
      title: response.error === response.message ? response.statusCode.toString() : response.error,
      message: response.message,
    });
  }
};
