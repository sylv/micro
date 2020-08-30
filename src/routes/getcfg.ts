import { FastifyReply, FastifyRequest } from "fastify";
import { ConfigGenerator } from "../classes/ConfigGenerator";
import { BadRequest } from "http-errors";
import { logger } from "../logger";

export async function getConfigHandler(
  request: FastifyRequest<{ Querystring: { key?: string; download?: string } }>,
  reply: FastifyReply
) {
  logger.debug("/getcfg", { download: request.query.download });
  if (!request.query.key) throw new BadRequest('Missing "key" query parameter');
  const generator = new ConfigGenerator();
  const config = generator.forShareX(request.query.key);
  // useful for debugging
  if (request.query.download !== "false") {
    reply.header("Content-Disposition", 'attachment; filename="micro.sxcu"');
  }

  return reply.header("Content-Type", "text/plain").send(config);
}
