import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { PasswordAuthGuard } from "../guards/PasswordAuthGuard";
import { TokenAudience } from "../types";
import { JWTPayloadUser } from "../strategies/JWTStrategy";

@Controller()
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post("api/auth/login")
  @UseGuards(PasswordAuthGuard)
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const payload: JWTPayloadUser = { name: req.user.username, sub: req.user.id };
    const token = this.jwtService.sign(payload, { audience: TokenAudience.USER });
    return reply
      .setCookie("token", token, {
        path: "/",
        domain: config.host,
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
        domain: config.host,
        httpOnly: true,
        secure: config.ssl,
        expires: new Date(),
      })
      .send({ ok: true });
  }
}
