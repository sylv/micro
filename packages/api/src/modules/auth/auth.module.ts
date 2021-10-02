import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { config } from "../../config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JWTStrategy } from "./strategies/jwt.strategy";
import { PasswordStrategy } from "./strategies/password.strategy";
import { User } from "../user/user.entity";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordStrategy, JWTStrategy],
  exports: [AuthService],
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
      secret: config.secret,
    }),
  ],
})
export class AuthModule {}
