import { BadRequestException, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { nanoid } from "nanoid";
import { config } from "../../config";
import { Permission } from "../../constants";
import { prisma } from "../../prisma";
import { AuthService, TokenType } from "../auth/auth.service";

export interface JWTPayloadInvite {
  id: string;
  inviter?: string;
  permissions?: number;
}

@Injectable()
export class InviteService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InviteService.name);
  constructor(private authService: AuthService) {}

  public async create(inviterId: string | undefined, permissions: Permission | undefined) {
    const payload: JWTPayloadInvite = { id: nanoid(16), inviter: inviterId, permissions };
    const token = await this.authService.signToken(TokenType.INVITE, payload, "1h");
    const url = config.rootHost.url + `/invite/${token}`;
    return {
      token,
      url,
    };
  }

  public async verifyToken(token: string) {
    const payload = await this.authService.verifyToken<JWTPayloadInvite>(TokenType.INVITE, token);
    const existing = await prisma.user.findFirst({ where: { invite: payload.id } });
    if (existing) throw new BadRequestException("That invite has already been used.");
    return payload;
  }

  public async onApplicationBootstrap() {
    const users = await prisma.user.count({ take: 1 });
    if (users >= 1) return;
    const invite = await this.create(undefined, Permission.ADMINISTRATOR);
    this.logger.log(`Go to ${invite.url} to create the first account.`);
  }
}
