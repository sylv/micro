import { Controller, Post, Req, UseGuards, Get } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { LocalAuthGuard } from "../guards/LocalAuthGuard";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";

export interface TokenResponse {
  access_token: string;
}

@Controller("auth")
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(LocalAuthGuard)
  @Post("token")
  async postToken(@Req() req: FastifyRequest): Promise<TokenResponse> {
    const token = this.jwtService.sign({ id: req.user });
    return { access_token: token };
  }

  @UseGuards(JWTAuthGuard)
  @Get("token")
  async getToken(@Req() req: FastifyRequest): Promise<TokenResponse> {
    const token = this.jwtService.sign({ id: req.user });
    return { access_token: token };
  }
}
