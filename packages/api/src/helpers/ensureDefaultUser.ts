import { Logger } from "@nestjs/common";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

/**
 * Ensure a default admin user exists. If it doesn't, generate one and log the login details to console.
 */
export async function ensureDefaultUser() {
  const logger = new Logger("ensureDefaultUser");
  const userRepo = getRepository(User);
  const users = await userRepo.count({ take: 1 });
  if (users >= 1) return logger.debug("At least one user exists, not creating default");
  const username = "admin";
  const passwordPlain = crypto.randomBytes(10).toString("hex");
  const passwordHashed = await bcrypt.hash(passwordPlain, 10);
  const user = new User();
  user.username = "admin";
  user.password = passwordHashed;
  await userRepo.save(user);
  logger.log(`Created default user, username = ${username} password = ${passwordPlain}`);
}
