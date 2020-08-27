import fastify from "fastify";
import multipart from "fastify-multipart";
import "hard-rejection/register";
import path from "path";
import { createConnection } from "typeorm";
import { config } from "./config";
import { logger } from "./logger";
import { deletionHandler } from "./routes/delete";
import { fileHandler } from "./routes/file";
import { thumbHandler } from "./routes/thumb";
import { uploadHandler } from "./routes/upload";

function bail(err: Error | undefined) {
  if (!err) return;
  console.error(err);
  process.exit(1);
}

// todo: on startup/every X check for files deleted from disk and delete them from the db.
async function main() {
  const port = process.env.PORT ? +process.env.PORT : 8080;
  const server = fastify();

  await createConnection({
    type: "sqlite",
    database: path.join(config.paths.base, ".microindex"),
    entities: [path.resolve(__dirname, "entities/**/*.{ts,js}")],
    synchronize: process.env.SYNCHRONIZE !== "true" && process.env.NODE_ENV !== "production",
  }).then(() => logger.info("Created database connection"));

  server.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: config.sizeLimits.upload,
      fields: 10,
      fileSize: config.sizeLimits.upload,
      files: 1,
      headerPairs: 2000,
    },
  });

  if (config.redirect) {
    server.get("/", async (req, reply) => reply.redirect(302, config.redirect!));
  }
  server.post("/upload", uploadHandler);
  server.get("/delete/:query", deletionHandler);
  server.get("/:query", fileHandler);
  server.get("/:query/thumbnail", thumbHandler);

  server.listen(port, "0.0.0.0", (err, address) => {
    if (err) bail(err);
    logger.info(`Listening on ${address} (${config.host}) NODE_ENV=${process.env.NODE_ENV}`);
  });
}

main().catch(bail);
