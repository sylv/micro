import type { FastifyRequest } from "fastify";

export function getHostFromRequest(request: FastifyRequest): string {
  if (request.headers["x-forwarded-host"]) {
    if (Array.isArray(request.headers["x-forwarded-host"])) {
      return request.headers["x-forwarded-host"][0]!;
    }

    return request.headers["x-forwarded-host"];
  }

  if (request.headers.host) return request.headers.host;
  return request.hostname;
}
