import { FastifyReply, FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { logger } from "../logger";

export async function deletionHandler(
  request: FastifyRequest<{ Querystring: { delete_key?: string } }>,
  reply: FastifyReply
) {
  const deletionKey = request.query.delete_key;
  if (!deletionKey) {
    return reply.status(404).send({ message: 'Missing "delete_key" query' });
  }

  const fileRepo = getRepository(File);
  const file = await fileRepo.findOne({ deletion_key: deletionKey });
  if (!file) return reply.status(404).send({ message: "Unknown file deletion key." });

  // file will handle removing its presence on-disk as long as we remove FileRepo.remove()
  // and not FileRepo.delete()
  logger.debug("/delete", { fileId: file.id, deletionKey });
  await fileRepo.remove(file);
  return reply.status(204).send();
}
