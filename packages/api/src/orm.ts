/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable import/no-default-export */
import { LoadStrategy } from '@mikro-orm/core';
import type { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { Logger, NotFoundException } from '@nestjs/common';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { FileMetadata } from './modules/file/file-metadata.embeddable.js';
import { File } from './modules/file/file.entity.js';
import { Invite } from './modules/invite/invite.entity.js';
import { Link } from './modules/link/link.entity.js';
import { Paste } from './modules/paste/paste.entity.js';
import { Thumbnail } from './modules/thumbnail/thumbnail.entity.js';
import { UserVerification } from './modules/user/user-verification.entity.js';
import { User } from './modules/user/user.entity.js';

export const ormLogger = new Logger('MikroORM');
export const migrationsTableName = 'mikro_orm_migrations';

export default {
  type: 'postgresql',
  entities: [FileMetadata, File, Thumbnail, User, UserVerification, Invite, Paste, Link],
  clientUrl: config.databaseUrl,
  debug: true,
  loadStrategy: LoadStrategy.JOINED,
  logger: (message) => {
    ormLogger.debug(message);
  },
  findOneOrFailHandler: () => {
    throw new NotFoundException();
  },
  migrations: {
    path: join(dirname(fileURLToPath(import.meta.url)), 'migrations'),
    tableName: migrationsTableName,
  },
} as MikroOrmModuleSyncOptions;
