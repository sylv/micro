import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { NotFoundException } from "@nestjs/common";
import { config } from "./config";
import { File } from "./modules/file/file.entity";
import { Invite } from "./modules/invite/invite.entity";
import { Thumbnail } from "./modules/thumbnail/thumbnail.entity";
import { User } from "./modules/user/user.entity";

export default {
  type: "postgresql",
  entities: [File, Thumbnail, User, Invite],
  clientUrl: config.databaseUrl,
  findOneOrFailHandler: () => {
    throw new NotFoundException();
  },
} as MikroOrmModuleSyncOptions;
