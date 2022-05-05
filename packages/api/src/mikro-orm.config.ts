import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { Logger, NotFoundException } from "@nestjs/common";
import { config } from "./config";
import { FileMetadata } from "./modules/file/file-metadata.embeddable";
import { File } from "./modules/file/file.entity";
import { Invite } from "./modules/invite/invite.entity";
import { Thumbnail } from "./modules/thumbnail/thumbnail.entity";
import { User } from "./modules/user/user.entity";

const logger = new Logger("MikroORM");

export default {
  type: "postgresql",
  entities: [FileMetadata, File, Thumbnail, User, Invite],
  clientUrl: config.databaseUrl,
  debug: true,
  logger: (message) => logger.debug(message),
  findOneOrFailHandler: () => {
    throw new NotFoundException();
  },
} as MikroOrmModuleSyncOptions;
