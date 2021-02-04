import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { getRepository } from "typeorm";
import { config } from "../config";
import { User } from "../entities/User";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: config.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), (req) => req.cookies.token]),
    });
  }

  async validate(payload: any) {
    // todo: this kind of invalidates the use of JWTs if we're going to double check with a database query anyway
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ id: payload.id });
    if (!user) throw new BadRequestException();
    return user.id;
  }
}
