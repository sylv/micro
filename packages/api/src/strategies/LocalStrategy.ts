import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { FastifyRequest } from "fastify";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  async validate(username: string, password: string): Promise<FastifyRequest["user"]> {
    const lowerUsername = username.toLowerCase();
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ username: lowerUsername }, { select: ["id", "username", "password"] });
    if (!user) throw new UnauthorizedException();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException();
    return {
      id: user.id,
      username: user.username,
    };
  }
}
