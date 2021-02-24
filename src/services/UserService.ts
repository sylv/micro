import { Injectable, ConflictException } from "@nestjs/common";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { JWTPayloadInvite } from "./InviteService";

@Injectable()
export class UserService {
  getUser(id: string) {
    const userRepo = getRepository(User);
    return userRepo.findOne(id);
  }

  deleteUser(id: string) {
    const userRepo = getRepository(User);
    return userRepo.delete(id);
  }

  getUserFiles(id: string, skip: number) {
    const fileRepo = getRepository(File);
    return fileRepo.find({
      take: 24,
      skip: skip,
      order: { createdAt: "DESC" },
      where: {
        owner: id,
      },
    });
  }

  async createUser(username: string, password: string, invite?: JWTPayloadInvite) {
    const userRepo = getRepository(User);
    const lowerUsername = username.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const existing = await userRepo.findOne({ username: lowerUsername });
    if (existing) throw new ConflictException("A user with that username already exists.");
    const user = userRepo.create({
      password: hashedPassword,
      username: lowerUsername,
      invite: invite?.id,
      permissions: invite?.permissions,
      inviter: {
        id: invite?.inviter,
      },
    });

    await userRepo.insert(user);
    return user;
  }
}
