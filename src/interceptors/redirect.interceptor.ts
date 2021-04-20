import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Observable } from "rxjs";
import { config } from "../config";

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const host = config.hosts.find((host) => host.pattern.test(request.hostname));
    if (!host) {
      response.redirect(StatusCodes.TEMPORARY_REDIRECT, config.rootHost.url);
      return next.handle();
    }

    if (host.redirect && request.url === "/") {
      response.redirect(StatusCodes.TEMPORARY_REDIRECT, host.redirect);
      return next.handle();
    }

    request.host = host;
    return next.handle();
  }
}
