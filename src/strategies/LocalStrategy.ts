import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  async validate(username: string, password: string): Promise<any> {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ username });
    if (!user) throw new UnauthorizedException();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException();
    return user.id;
  }
}
