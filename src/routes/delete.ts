import { FastifyReply, FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { logger } from "../logger";
import { NotFound } from "http-errors";

export async function deletionHandler(
  request: FastifyRequest<{ Params: { query?: string } }>,
  reply: FastifyReply
) {
  const deletionKey = request.params.query;
  if (!deletionKey) {
    throw new NotFound('Missing "delete_key" querystring');
  }

  const fileRepo = getRepository(File);
  const file = await fileRepo.findOne({ deletion_key: deletionKey });
  if (!file) throw new NotFound();

  // file will handle removing its presence on-disk as long as we remove FileRepo.remove()
  // and not FileRepo.delete()
  logger.debug("/delete", { fileId: file.id, deletionKey });
  await fileRepo.remove(file);
  return reply.status(204).send();
}
