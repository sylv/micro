import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { Conflict, Unauthorized, InternalServerError } from "http-errors";
import { pipeline } from "stream";
import { getRepository } from "typeorm";
import util from "util";
import { config } from "../config";
import { File } from "../entities/File";
import { logger } from "../logger";
import fileType from "file-type";
import { v4 as uuidv4 } from "uuid";

const pump = util.promisify(pipeline);
const pathLength = "/upload".length;

export async function uploadHandler(
  request: FastifyRequest<{ Querystring: { api_key?: string; host?: string } }>,
  reply: FastifyReply
) {
  let baseUrl = request.query.host;
  if (!baseUrl) {
    const pathPrefix = request.raw.url?.slice(0, -pathLength) || "/";
    const host = request.headers.host;
    if (!host) throw new InternalServerError();
    const protocol = config.https ? "https://" : "http://";
    baseUrl = `${protocol}${host}${pathPrefix}`;
  }

  if (!baseUrl.endsWith("/")) baseUrl += "/";
  // some basic auth that should be improved in the future
  const key = request.headers.authorization ?? request.query.api_key;
  const user = key && config.keys.get(key);
  if (!user) throw new Unauthorized();
  logger.debug("/upload", { user });
  const data = await request.file();
  const uploadStream = await fileType.stream(data.file as any);
  const uploadType = uploadStream.fileType ?? {
    ext: "",
    mime: "application/octet-stream",
  };

  const fileRepo = getRepository(File);
  const file = new File();
  file.id = uuidv4();
  file.name = data.filename;
  file.extension = uploadType.ext;
  file.owner = user;
  file.mime_type = uploadType.mime;
  const filePath = File.getFilePath(file);

  // count bytes to save an fs.stat, could also add limits here but i believe fastify handles
  // that for us
  let receivedBytesTotal = 0;
  uploadStream.on("data", (chunk) => {
    receivedBytesTotal += chunk.length;
  });

  try {
    await pump(uploadStream, fs.createWriteStream(filePath));
    file.size_bytes = receivedBytesTotal;
    await fileRepo.save(file);

    const url = baseUrl + data.filename;
    const thumbnailUrl = url + "/thumbnail";
    const deletionUrl = baseUrl + `delete/${file.deletion_key}`;

    logger.debug(`/upload: complete`, {
      user,
      url,
      id: file.id,
      mime: uploadType.mime,
    });

    return reply.send({
      url,
      thumbnailUrl,
      deletionUrl,
    });
  } catch (e) {
    // delete failed upload if exists on disk
    await fs.promises.unlink(filePath).catch((e) => false);

    if (e.code === "SQLITE_CONSTRAINT") {
      logger.info("/upload: error - duplicate filename", { user, filename: data.filename });
      return new Conflict("A file already exists with that name.");
    }

    logger.warn(`/upload: error`, { user });
    throw e;
  }
}
