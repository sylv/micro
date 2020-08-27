import randomString from "crypto-random-string";
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import util from "util";
import { config } from "../config";
import { File } from "../entities/File";
import { getRepository } from "typeorm";
import { logger } from "../logger";
import { classToPlain } from "class-transformer";

const pump = util.promisify(pipeline);

export async function uploadHandler(
  request: FastifyRequest<{ Querystring: { api_key?: string } }>,
  reply: FastifyReply
) {
  // some basic auth that should be improved in the future
  const key = request.headers.authorization ?? request.query.api_key;
  const user = key && config.keys.get(key);
  if (!user) return reply.status(401).send({ message: "Invalid or missing authorisation." });
  logger.debug("/upload", { user });
  // we need to write to a temporary path so we can get the file size
  // because we can't create File and get the final path without it
  const data = await request.file();
  const extension = data.filename.split(".").slice(-1).shift() ?? "";
  const temporaryName = randomString({ length: 20, type: "hex" }) + '.motmp'; // prettier-ignore
  const temporaryPath = path.join(config.uploadPath.base, temporaryName);
  const writeStream = fs.createWriteStream(temporaryPath);

  // count bytes to safe an fs.stat, could also add limits here but i believe fastify handles
  // that for us
  let receivedBytesTotal = 0;
  data.file.on("data", (chunk) => {
    receivedBytesTotal += chunk.length;
  });

  try {
    await pump(data.file, writeStream);
    const fileRepo = getRepository(File);
    const file = new File();
    file.name = data.filename;
    file.extension = extension;
    file.owner = user;
    file.mime_type = data.mimetype;
    file.size_bytes = receivedBytesTotal;
    // getFilePath requires an ID that is only populated once saved
    await fileRepo.save(file);
    const finalPath = File.getFilePath(file);
    await fs.promises.rename(temporaryPath, finalPath);
    const url = config.host + `/${data.filename}`;
    const deletion_url = config.host + `/delete?delete_key=${file.deletion_key}`;
    logger.debug(`/upload: complete`, { user, id: file.id });
    return reply.send({
      url,
      deletion_url,
      file: classToPlain(file),
      // debug: {
      //   temporaryPath,
      //   receivedBytesTotal,
      //   file,
      //   finalPath,
      // },
    });
  } catch (e) {
    await fs.promises.unlink(temporaryPath);
    if (e.code === "SQLITE_CONSTRAINT") {
      logger.info("/upload: error - duplicate filename", { user, filename: data.filename });
      return reply.status(409).send({
        message: `A file already exists with that name.`,
      });
    }

    logger.warn(`/upload: error`, { user });
    throw e;
  }
}
