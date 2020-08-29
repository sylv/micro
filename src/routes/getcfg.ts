import { FastifyReply, FastifyRequest } from "fastify";
import { ConfigGenerator } from "../classes/ConfigGenerator";
import { BadRequest } from "http-errors";

export async function getConfigHandler(
  request: FastifyRequest<{ Querystring: { key?: string } }>,
  reply: FastifyReply
) {
  if (!request.query.key) throw new BadRequest('Missing "key" query parameter');
  const generator = new ConfigGenerator();
  const config = generator.forShareX(request.query.key);
  return reply
    .header("Content-Type", "text/plain")
    .header("Content-Disposition", 'attachment; filename="micro.sxcu"')
    .send(config);
}
