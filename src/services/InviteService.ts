import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { getRepository } from "typeorm";
import { Invite } from "../entities/Invite";

@Injectable()
export class InviteService {
  async getInvite(id: string) {
    const inviteRepo = getRepository(Invite);
    const invite = await inviteRepo.findOne(id, { relations: ["invited", "inviter"] });
    if (!invite || invite.invalid) throw new NotFoundException("Invite does not exist or expired.");
    if (invite.invited) throw new ConflictException("Invite has been used.");
    return invite;
  }

  async createInvite(inviterId: string | undefined) {
    const inviteRepo = getRepository(Invite);
    const invite = inviteRepo.create({
      inviter: {
        id: inviterId,
      },
    });

    await inviteRepo.save(invite);
    return invite;
  }
}
