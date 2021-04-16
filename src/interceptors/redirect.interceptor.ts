import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Observable } from "rxjs";
import { config } from "../config";

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    if (request.url.includes("/api")) return next.handle();
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const host = config.hosts.find((host) => host.pattern.test(request.hostname));
    if (!host) {
      response.redirect(StatusCodes.TEMPORARY_REDIRECT, config.hosts[0].url);
      return next.handle();
    }

    if (host.redirect && request.url === "/") {
      response.redirect(StatusCodes.TEMPORARY_REDIRECT, host.redirect);
      return next.handle();
    }

    return next.handle();
  }
}
