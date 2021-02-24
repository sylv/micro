import { BadRequestException, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { generateId } from "../helpers/generateId";
import { Permission, TokenAudience, User } from "../types";
import { getRepository } from "typeorm";
import { formatUrl } from "../helpers/formatUrl";
import { config } from "../config";

export interface JWTPayloadInvite {
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
    const payload: JWTPayloadInvite = { id: generateId(16), inviter: inviterId, permissions };
    return this.jwtService.sign(payload, {
      audience: TokenAudience.INVITE,
      expiresIn: "1h",
    });
  }

  async verifyInviteToken(key: string): Promise<JWTPayloadInvite> {
    const payload = await this.jwtService.verifyAsync<JWTPayloadInvite>(key, {
      audience: TokenAudience.INVITE,
    });

    const userRepo = getRepository(User);
    const existing = await userRepo.findOne({ invite: payload.id });
    if (existing) throw new BadRequestException("That invite has already been used.");
    return payload;
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
