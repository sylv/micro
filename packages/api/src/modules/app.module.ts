import MikroOrmOptions from '../orm.config.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { AppResolver } from './app.resolver.js';
import { AuthModule } from './auth/auth.module.js';
import { FileModule } from './file/file.module.js';
import { HostModule } from './host/host.module.js';
import { InviteModule } from './invite/invite.module.js';
import { PasteModule } from './paste/paste.module.js';
import { StorageModule } from './storage/storage.module.js';
import { UserModule } from './user/user.module.js';
import { ThumbnailModule } from './thumbnail/thumbnail.module.js';

@Module({
  providers: [AppResolver],
  imports: [
    MikroOrmModule.forRoot(MikroOrmOptions),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: false,
      sortSchema: true,
      allowBatchedQueries: true,
      autoSchemaFile: 'src/schema.gql',
    }),
    ScheduleModule.forRoot(),
    PassportModule,
    StorageModule,
    HostModule,
    AuthModule,
    FileModule,
    ThumbnailModule,
    InviteModule,
    UserModule,
    PasteModule,
  ],
})
export class AppModule {}
