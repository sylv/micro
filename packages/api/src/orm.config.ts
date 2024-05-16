import { FlushMode } from "@mikro-orm/core";
import { Logger, NotFoundException } from "@nestjs/common";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { FileMetadata } from "./modules/file/file-metadata.embeddable.js";
import { FileEntity } from "./modules/file/file.entity.js";
import { InviteEntity } from "./modules/invite/invite.entity.js";
import { LinkEntity } from "./modules/link/link.entity.js";
import { PasteEntity } from "./modules/paste/paste.entity.js";
import { ThumbnailEntity } from "./modules/thumbnail/thumbnail.entity.js";
import { UserVerificationEntity } from "./modules/user/user-verification.entity.js";
import { UserEntity } from "./modules/user/user.entity.js";
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

export const ORM_LOGGER = new Logger("MikroORM");
export const MIGRATIONS_TABLE_NAME = "mikro_orm_migrations";

export default defineConfig({
  entities: [
    FileMetadata,
    FileEntity,
    ThumbnailEntity,
    UserEntity,
    UserVerificationEntity,
    InviteEntity,
    PasteEntity,
    LinkEntity,
  ],
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
