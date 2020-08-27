import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { BadRequest, NotFound } from "http-errors";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { logger } from "../logger";
import { config } from "../config";

export async function thumbHandler(
  request: FastifyRequest<{ Params: { query: string } }>,
  reply: FastifyReply
) {
  const query = request.params.query;
  if (!query) throw new BadRequest("Missing thumbnail ID");
  const fileRepo = getRepository(File);
  const file = await fileRepo.findOne({ where: [{ id: query }, { name: query }] });
  if (!file) return new NotFound();
  const thumbPath = File.getThumbPath(file);
  if (!thumbPath) throw new BadRequest("Cannot generate thumbnails for that file");
  const exists = fs.existsSync(thumbPath);
  if (!exists) {
    if (!config.thumbnailSize || config.thumbnailSize <= 0) {
      throw new BadRequest("Thumbnail generation is disabled on this server.");
    }

    const filePath = File.getFilePath(file);
    const originalExists = fs.existsSync(filePath);
    if (!originalExists) {
      await fileRepo.delete(file);
      throw new NotFound();
    }

    const timer = logger.startTimer();
    await sharp(filePath).resize(config.thumbnailSize).toFile(thumbPath);
    timer.done({ message: "/thumb: generate", id: file.id });
  }

  logger.debug("/thumb", { id: file.id });
  const stream = fs.createReadStream(thumbPath);
  return reply.header("Content-Type", "image/jpeg").send(stream);
}
