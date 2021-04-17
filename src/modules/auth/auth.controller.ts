import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../config";
import { PasswordAuthGuard } from "../../guards/password.guard";
import { JWTPayloadUser } from "../../strategies/jwt.strategy";
import { AuthService, TokenType } from "./auth.service";
import ms from "ms";

@Controller()
export class AuthController {
  private static readonly DOMAIN = config.rootHost.key.split(":").shift()!;
  private static readonly SECURE = config.rootHost.url.startsWith("https");
  private static readonly ONE_YEAR = ms("1y");
  private static readonly COOKIE_OPTIONS = {
    path: "/",
    httpOnly: true,
    domain: AuthController.DOMAIN,
    secure: AuthController.SECURE,
  };

  constructor(private authService: AuthService) {}

  @Post("api/auth/login")
  @UseGuards(PasswordAuthGuard)
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const payload: JWTPayloadUser = { name: req.user.username, id: req.user.id, secret: req.user.secret };
    const expiresAt = Date.now() + AuthController.ONE_YEAR;
    const token = await this.authService.signToken<JWTPayloadUser>(TokenType.USER, payload, "1y");
    return reply
      .setCookie("token", token, {
        ...AuthController.COOKIE_OPTIONS,
        expires: new Date(expiresAt),
      })
      .send({ ok: true });
  }

  @Post("api/auth/logout")
  async logout(@Res() reply: FastifyReply) {
    return reply
      .setCookie("token", "", {
        ...AuthController.COOKIE_OPTIONS,
        expires: new Date(),
      })
      .send({ ok: true });
  }
}
