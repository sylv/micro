import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { LocalAuthGuard } from "../guards/LocalAuthGuard";

export interface TokenResponse {
  access_token: string;
}

@Controller("auth")
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply): Promise<TokenResponse> {
    const token = this.jwtService.sign({ id: req.user });
    const domain = new URL(config.host).hostname;
    return reply
      .setCookie("token", token, {
        path: "/",
        domain: domain,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .send({ ok: true });
  }

  @Post("logout")
  async logout(@Res() reply: FastifyReply) {
    const domain = new URL(config.host).hostname;
    return reply
      .setCookie("token", "", {
        path: "/",
        domain: domain,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(),
      })
      .send({ ok: true });
  }
}
