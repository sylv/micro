import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { map } from "rxjs";

export class SerializerInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse<FastifyReply>();
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) return data;
        if (typeof data === "object") {
          void response.header("Content-Type", "application/json");
          return JSON.stringify(data);
        }

        throw new Error(`Do not know how to serialize "${data}"`);
      })
    );
  }
}
