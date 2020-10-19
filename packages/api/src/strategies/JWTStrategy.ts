import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, BadRequestException } from "@nestjs/common";
import { config } from "../config";
import { getRepository } from "typeorm";
import { User, UserFlag } from "../entities/User";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt_secret,
    });
  }

  async validate(payload: any) {
    // todo: this kind of invalidates the use of JWTs if we're going to double check with a database query anyway
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ id: payload.id });
    if (!user || (user.flags & UserFlag.BANNED) === UserFlag.BANNED) throw new BadRequestException();
    return user.id;
  }
}
