import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "../config";
import { AppController } from "../controllers/AppController";
import { AuthController } from "../controllers/AuthController";
import { FileController } from "../controllers/FileController";
import { UploadController } from "../controllers/UploadController";
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

@Module({
  // i am fully aware you are meant to have separate modules, services and controllers for everything
  // but that seems like a shit ton of boilerplate and im a lazy little shit at the moment
  providers: [FileService, ThumbnailService, JWTStrategy, LocalStrategy, LinkService],
  controllers: [
    AppController,
    FileController,
    UploadController,
    AuthController,
    UserController,
    ThumbnailController,
    LinkController,
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.jwt_secret,
      signOptions: {
        expiresIn: "30d",
      },
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.database.uri,
      synchronize: config.database.synchronize,
      entities: [User, Thumbnail, File, Link],
    }),
  ],
})
export class AppModule {}
