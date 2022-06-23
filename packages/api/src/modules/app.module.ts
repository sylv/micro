import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import MikroOrmOptions from '../orm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { HostModule } from './host/host.module';
import { InviteModule } from './invite/invite.module';
import { PasteModule } from './paste/paste.module';
import { StorageModule } from './storage/storage.module';
import { ThumbnailModule } from './thumbnail/thumbnail.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AppController],
  providers: [],
  imports: [
    MikroOrmModule.forRoot(MikroOrmOptions),
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
