import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../config";
import { PasswordAuthGuard } from "../../guards/PasswordAuthGuard";
import { JWTPayloadUser } from "../../strategies/JWTStrategy";
import { AuthService, TokenType } from "./auth.service";

@Controller()
export class AuthController {
  private static readonly DOMAIN = config.host.split(":").shift()!;
  constructor(private authService: AuthService) {}

  @Post("api/auth/login")
  @UseGuards(PasswordAuthGuard)
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const payload: JWTPayloadUser = { name: req.user.username, sub: req.user.id };
    const token = await this.authService.signToken(TokenType.USER, payload);
    return reply
      .setCookie("token", token, {
        path: "/",
        domain: AuthController.DOMAIN,
        httpOnly: true,
        secure: config.ssl,
      })
      .send({ ok: true });
  }

  @Post("api/auth/logout")
  async logout(@Res() reply: FastifyReply) {
    return reply
      .setCookie("token", "", {
        path: "/",
        domain: AuthController.DOMAIN,
        httpOnly: true,
        secure: config.ssl,
        expires: new Date(),
      })
      .send({ ok: true });
  }
}
