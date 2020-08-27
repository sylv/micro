import { classToPlain } from "class-transformer";
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { NotFound } from "http-errors";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { logger } from "../logger";

export async function fileHandler(
  request: FastifyRequest<{ Querystring: { debug?: string }; Params: { query: string } }>,
  reply: FastifyReply
) {
  const debug = request.query.debug === "true";
  const query = request.params.query;
  if (!query) throw new NotFound();
  const fileRepo = getRepository(File);
  const file = await fileRepo.findOne({ where: [{ name: query }, { id: query }] });
  const filePath = file && File.getFilePath(file);
  // ideally we would just catch fs.createReadStream errors and save ourselves a
  // fs call but that's really annoying to do and i don't wanna do it so this should work fine
  const existsOnDisk = filePath && fs.existsSync(filePath);
  if (!file || !filePath || !existsOnDisk) {
    // don't have to use fileRepo.remove() because that hook will try delete the already deleted file.
    if (file && !existsOnDisk) await fileRepo.delete(file);
    throw new NotFound();
  }

  if (debug) return reply.send(classToPlain(file));
  const fileStream = fs.createReadStream(filePath);
  logger.debug(`/file`, { fileId: file.id, fileName: file.name });
  return reply.header("Content-Type", file.mime_type).send(fileStream);
}
