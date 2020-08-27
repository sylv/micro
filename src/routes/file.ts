import { classToPlain } from "class-transformer";
import { FastifyRequest, FastifyReply } from "fastify";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import fs from "fs";
import { logger } from "../logger";
import { config } from "../config";

export async function fileHandler(
  request: FastifyRequest<{ Querystring: { debug?: string }; Params: { filename: string } }>,
  reply: FastifyReply
) {
  const debug = request.query.debug === "true";
  const fileName = request.params.filename;
  if (!fileName) {
    if (config.redirect) reply.redirect(301, config.redirect);
    return reply.status(400).send({ message: "Missing file name" });
  }

  const fileRepo = getRepository(File);
  const file = await fileRepo.findOne({ name: fileName });
  const filePath = file && File.getFilePath(file);
  // ideally we would just catch fs.createReadStream errors and save ourselves a
  // fs call but that's really annoying to do and i don't wanna do it so this should work fine
  const existsOnDisk = filePath && fs.existsSync(filePath);
  if (!file || !filePath || !existsOnDisk) {
    // don't have to use fileRepo.remove() because that hook will try delete the already deleted file.
    if (file && !existsOnDisk) await fileRepo.delete(file);
    if (config.redirect) reply.redirect(301, config.redirect);
    return reply.status(404).send({ message: "Unknown file" });
  }

  if (debug) return reply.send(classToPlain(file));
  const fileStream = fs.createReadStream(filePath);
  logger.debug(`/file`, { fileId: file.id, fileName: file.name });
  return reply.header("Content-Type", file.mime_type).send(fileStream);
}
