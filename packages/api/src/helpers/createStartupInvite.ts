import { Logger } from "@nestjs/common";
import { getRepository, MoreThan } from "typeorm";
import { config } from "../config";
import { Invite } from "../entities/Invite";
import { User } from "../entities/User";
import { formatUrl } from "./formatUrl";

// todo: user created with first invite should get admin perms
export async function createStartupInvite() {
  const logger = new Logger("createStartupInvite");
  const userRepo = getRepository(User);
  const users = await userRepo.count({ take: 1 });
  if (users >= 1) return logger.debug("At least one user exists, not creating default");
  const inviteRepo = getRepository(Invite);
  const existing = await inviteRepo.findOne({ where: { inviter: null, expiresAt: MoreThan(Date.now()) } });
  const invite = existing ?? inviteRepo.create();
  if (!existing) {
    await inviteRepo.delete({});
    await inviteRepo.save(invite);
  }

  logger.log(`Go to "${formatUrl(config.host, invite.url.view)}" to create the first account.`);
}
