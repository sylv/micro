import randomString from "crypto-random-string";
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { Conflict, Unauthorized } from "http-errors";
import path from "path";
import { pipeline } from "stream";
import { getRepository } from "typeorm";
import util from "util";
import { config } from "../config";
import { File } from "../entities/File";
import { logger } from "../logger";
import fileType from "file-type";

const pump = util.promisify(pipeline);

export async function uploadHandler(
  request: FastifyRequest<{ Querystring: { api_key?: string } }>,
  reply: FastifyReply
) {
  // some basic auth that should be improved in the future
  const key = request.headers.authorization ?? request.query.api_key;
  const user = key && config.keys.get(key);
  if (!user) throw new Unauthorized();
  logger.debug("/upload", { user });
  // we need to write to a temporary path so we can get the file size
  // because we can't create File and get the final path without it
  const data = await request.file();
  const temporaryName = randomString({ length: 20, type: "hex" });
  const temporaryPath = path.join(config.paths.temp, temporaryName);
  const writeStream = fs.createWriteStream(temporaryPath);
  const uploadStream = await fileType.stream(data.file as any);
  const uploadType = uploadStream.fileType ?? {
    ext: "",
    mime: "application/octet-stream",
  };

  // count bytes to safe an fs.stat, could also add limits here but i believe fastify handles
  // that for us
  let receivedBytesTotal = 0;
  uploadStream.on("data", (chunk) => {
    receivedBytesTotal += chunk.length;
  });

  try {
    await pump(uploadStream, writeStream);
    const fileRepo = getRepository(File);
    const file = new File();
    file.name = data.filename;
    file.extension = uploadType.ext;
    file.owner = user;
    file.mime_type = uploadType.mime;
    file.size_bytes = receivedBytesTotal;
    // getFilePath requires an ID that is only populated once saved
    await fileRepo.save(file);
    const finalPath = File.getFilePath(file);
    await fs.promises.rename(temporaryPath, finalPath);
    const url = `${config.host}/${data.filename}`;
    const thumbnail_url = `${url}/thumbnail`;
    const deletion_url = config.host + `/delete/${file.deletion_key}`;
    logger.debug(`/upload: complete`, {
      user,
      id: file.id,
      temporaryPath,
      finalPath,
      uploadType,
    });

    return reply.send({
      url,
      thumbnail_url,
      deletion_url,
    });
  } catch (e) {
    await fs.promises.unlink(temporaryPath);
    if (e.code === "SQLITE_CONSTRAINT") {
      logger.info("/upload: error - duplicate filename", { user, filename: data.filename });
      return new Conflict("A file already exists with that name.");
    }

    logger.warn(`/upload: error`, { user });
    throw e;
  }
}
