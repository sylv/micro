import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "../config";
import { AppController } from "../controllers/AppController";
import { AuthController } from "../controllers/AuthController";
import { FileController } from "../controllers/FileController";
import { UserController } from "../controllers/UserController";
import { File } from "../entities/File";
import { Thumbnail } from "../entities/Thumbnail";
import { User } from "../entities/User";
import { FileService } from "../services/FileService";
import { ThumbnailService } from "../services/ThumbnailService";
import { JWTStrategy } from "../strategies/JWTStrategy";
import { LocalStrategy } from "../strategies/LocalStrategy";
import { ThumbnailController } from "../controllers/ThumbnailController";
import { LinkController } from "../controllers/LinkController";
import { LinkService } from "../services/LinkService";
import { Link } from "../entities/Link";
import Next from "next";
import { RenderModule } from "nest-next";
import { resolve } from "path";
import { Invite } from "../entities/Invite";
import { InviteController } from "../controllers/InviteController";
import { DeletionController } from "../controllers/DeletionController";
import { DeletionService } from "../services/DeletionService";
import { InviteService } from "../services/InviteService";
import { UserService } from "../services/UserService";
import { ShareXController } from "../controllers/ShareXController";
import { S3Service } from "../services/S3Service";

@Module({
  // this will be done properly soon. maybe.
  providers: [
    S3Service,
    JWTStrategy,
    LocalStrategy,
    DeletionService,
    FileService,
    InviteService,
    LinkService,
    ThumbnailService,
    UserService,
  ],
  controllers: [
    AppController,
    AuthController,
    DeletionController,
    FileController,
    InviteController,
    LinkController,
    ShareXController,
    ThumbnailController,
    UserController,
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.secret,
      signOptions: {
        expiresIn: "30d",
      },
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.database.uri,
      synchronize: config.database.synchronize,
      entities: [User, Thumbnail, File, Link, Invite],
    }),
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== "production",
        dir: resolve("../web"),
      }),
      {
        passthrough404: true,
        viewsDir: null,
      }
    ),
  ],
})
export class AppModule {}
