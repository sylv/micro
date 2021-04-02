import { BadRequestException, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { nanoid } from "nanoid";
import { getRepository } from "typeorm";
import { config } from "../config";
import { Permission, TokenAudience } from "../constants";
import { User } from "../entities/User";
import { formatUrl } from "../helpers/formatUrl";

export interface JWTPayloadInvite {
  aud?: TokenAudience;
  exp?: number;
  iat?: number;
  id: string;
  inviter?: string;
  permissions?: number;
}

@Injectable()
export class InviteService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InviteService.name);
  constructor(private jwtService: JwtService) {}

  getInviteUrl(token: string) {
    return formatUrl(config.host, `/invite/${token}`);
  }

  signInviteToken(inviterId: string | undefined, permissions?: Permission | undefined) {
    const payload: JWTPayloadInvite = { id: nanoid(16), inviter: inviterId, permissions };
    return this.jwtService.sign(payload, {
      audience: TokenAudience.INVITE,
      expiresIn: "1h",
    });
  }

  async verifyInviteToken(key: string): Promise<JWTPayloadInvite> {
    try {
      const payload = await this.jwtService.verifyAsync<JWTPayloadInvite>(key, {
        audience: TokenAudience.INVITE,
      });

      const userRepo = getRepository(User);
      const existing = await userRepo.findOne({ invite: payload.id });
      if (existing) throw new BadRequestException("That invite has already been used.");
      return payload;
    } catch (e) {
      throw new BadRequestException("Token validation failed.");
    }
  }

  async onApplicationBootstrap() {
    const userRepo = getRepository(User);
    const users = await userRepo.count({ take: 1 });
    if (users >= 1) return;
    const token = this.signInviteToken(undefined, Permission.ADMINISTRATOR);
    const url = this.getInviteUrl(token);
    this.logger.log(`Go to ${url} to create the first account.`);
  }
}
