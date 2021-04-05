import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { config } from "../../config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    JwtModule.register({
      secret: config.secret,
    }),
  ],
})
export class AuthModule {}
