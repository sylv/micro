import { HttpException, HttpStatus, InternalServerErrorException, Logger } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { RenderableReply } from "../types";

export const errorHandler = async (err: any, request: FastifyRequest, reply: RenderableReply) => {
  const isWrapped = err instanceof HttpException;
  const wrapped = isWrapped ? err : new InternalServerErrorException(err.message);
  const response = wrapped.getResponse() as any;
  const status = wrapped.getStatus();
  if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
    const logger = new Logger("ErrorHandler");
    logger.error(err.message, err.stack);
  }

  if (request.url.startsWith("/api")) {
    return reply.status(status).send(response);
  }

  // let NOT_FOUND fall through to nest for routing
  if (status !== StatusCodes.NOT_FOUND) {
    return reply.render("_error", {
      status: status.toString(),
      message: response.message,
    });
  }
};
