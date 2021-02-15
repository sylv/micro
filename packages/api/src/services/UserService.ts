import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { User } from "../entities/User";
import { Invite } from "../entities/Invite";
import bcrypt from "bcrypt";

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
      order: { createdAt: -1 },
      where: {
        owner: id,
      },
    });
  }

  async createUser(username: string, password: string, invite?: Invite) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRepo = getRepository(User);
    const user = userRepo.create({
      password: hashedPassword,
      username,
      invite,
    });

    await userRepo.save(user);
    return user;
  }
}
