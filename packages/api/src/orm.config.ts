import { FlushMode } from "@mikro-orm/core";
import type { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { Logger, NotFoundException } from "@nestjs/common";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { FileMetadata } from "./modules/file/file-metadata.embeddable.js";
import { File } from "./modules/file/file.entity.js";
import { Invite } from "./modules/invite/invite.entity.js";
import { Link } from "./modules/link/link.entity.js";
import { Paste } from "./modules/paste/paste.entity.js";
import { Thumbnail } from "./modules/thumbnail/thumbnail.entity.js";
import { UserVerification } from "./modules/user/user-verification.entity.js";
import { User } from "./modules/user/user.entity.js";
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

export const ORM_LOGGER = new Logger("MikroORM");
export const MIGRATIONS_TABLE_NAME = "mikro_orm_migrations";

export default defineConfig({
  entities: [FileMetadata, File, Thumbnail, User, UserVerification, Invite, Paste, Link],
  clientUrl: config.databaseUrl,
  debug: true,
  extensions: [Migrator],
  flushMode: FlushMode.COMMIT,
  logger: (message) => {
    ORM_LOGGER.debug(message);
  },
  findOneOrFailHandler: () => {
    throw new NotFoundException();
  },
  migrations: {
    path: join(fileURLToPath(dirname(import.meta.url)), "migrations"),
    tableName: MIGRATIONS_TABLE_NAME,
  },
});
