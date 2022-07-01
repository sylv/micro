import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import MikroOrmOptions from '../orm';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { HostModule } from './host/host.module';
import { InviteModule } from './invite/invite.module';
import { PasteModule } from './paste/paste.module';
import { StorageModule } from './storage/storage.module';
import { ThumbnailModule } from './thumbnail/thumbnail.module';
import { UserModule } from './user/user.module';

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
      errorFormatter: (execution) => {
        return {
          statusCode: 200,
          response: execution,
        };
      },
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
