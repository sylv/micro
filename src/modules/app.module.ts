import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { RenderModule } from "nest-next";
import next from "next";
import { IS_DEV } from "../constants";
import { JWTStrategy } from "../strategies/jwt.strategy";
import { PasswordStrategy } from "../strategies/password.strategy";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DeletionModule } from "./deletion/deletion.module";
import { FileModule } from "./file/file.module";
import { HostsModule } from "./hosts/hosts.module";
import { InviteModule } from "./invite/invite.module";
import { LinkModule } from "./link/link.module";
import { UploadModule } from "./upload/upload.module";
import { StorageModule } from "./storage/storage.module";
import { ThumbnailModule } from "./thumbnail/thumbnail.module";
import { UserModule } from "./user/user.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  controllers: [AppController],
  providers: [],
  imports: [
    PassportModule,
    JWTStrategy,
    StorageModule,
    HostsModule,
    PasswordStrategy,
    DeletionModule,
    AuthModule,
    FileModule,
    ThumbnailModule,
    InviteModule,
    LinkModule,
    UploadModule,
    UserModule,
    ScheduleModule.forRoot(),
    RenderModule.forRootAsync(next({ dev: IS_DEV }), {
      passthrough404: true,
      viewsDir: null,
    }),
  ],
})
export class AppModule {}
