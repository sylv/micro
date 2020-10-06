import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "../config";
import { FileController } from "../controllers/FileController";
import { UploadController } from "../controllers/UploadController";
import { UserController } from "../controllers/UserController";
import { File } from "../entities/File";
import { User } from "../entities/User";
import { FileService } from "../services/FileService";
import { JWTStrategy } from "../strategies/JWTStrategy";
import { LocalStrategy } from "../strategies/LocalStrategy";
import { AuthController } from "../controllers/AuthController";
import { ThumbnailService } from "../services/ThumbnailService";
import { AppController } from "../controllers/AppController";

@Module({
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
      entities: [User, File],
    }),
  ],
  // i am fully aware you are meant to have separate modules, services and controllers for everything
  // but that seems like a shit ton of boilerplate and this works fine.
  providers: [FileService, ThumbnailService, JWTStrategy, LocalStrategy],
  controllers: [AppController, FileController, UploadController, AuthController, UserController],
})
export class AppModule {}
