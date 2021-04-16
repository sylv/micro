import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import { FastifyRequest } from "fastify";
import { prisma } from "../prisma";

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy) {
  async validate(username: string, password: string): Promise<FastifyRequest["user"]> {
    const lowerUsername = username.toLowerCase();
    const user = await prisma.user.findFirst({
      where: { username: lowerUsername },
    });

    if (!user) throw new UnauthorizedException();
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedException();
    return user;
  }
}
