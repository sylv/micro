/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable import/no-default-export */
import type { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { Logger, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { config } from './config';
import { FileMetadata } from './modules/file/file-metadata.embeddable';
import { File } from './modules/file/file.entity';
import { Invite } from './modules/invite/invite.entity';
import { Link } from './modules/link/link.entity';
import { Paste } from './modules/paste/paste.entity';
import { Thumbnail } from './modules/thumbnail/thumbnail.entity';
import { User } from './modules/user/user.entity';

export const ormLogger = new Logger('MikroORM');
export const migrationsTableName = 'mikro_orm_migrations';

export default {
  type: 'postgresql',
  entities: [FileMetadata, File, Thumbnail, User, Invite, Paste, Link],
  clientUrl: config.databaseUrl,
  debug: true,
  logger: (message) => {
    ormLogger.debug(message);
  },
  findOneOrFailHandler: () => {
    throw new NotFoundException();
  },
  migrations: {
    path: join(__dirname, 'migrations'),
    tableName: migrationsTableName,
  },
} as MikroOrmModuleSyncOptions;
