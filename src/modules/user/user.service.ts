import { User } from ".prisma/client";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Permission } from "../../constants";
import { generateContentId } from "../../helpers/generateContentId";
import { prisma } from "../../prisma";
import { JWTPayloadInvite } from "../invite/invite.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserFilesQueryDto } from "./dto/user-files-query.dto";

@Injectable()
export class UserService {
  async getUser(id: string, secret: true): Promise<Omit<User, "password">>;
  async getUser(id: string, secret?: false): Promise<Omit<User, "password" | "secret">>;
  async getUser(id: string, secret = false) {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        invite: true,
        secret: secret,
        permissions: true,
        tags: true,
      },
    });

    if (!user) throw new NotFoundException(`Invalid user ID`);
    return user;
  }

  getUserFiles(userId: string, dto?: UserFilesQueryDto) {
    return prisma.file.findMany({
      take: dto?.take ?? 24,
      skip: dto?.cursor ? 1 : 0,
      cursor: dto?.cursor ? { id: dto?.cursor } : undefined,
      orderBy: { createdAt: "desc" },
      where: {
        ownerId: userId,
      },
    });
  }

  deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async createUser(data: CreateUserDto, invite: JWTPayloadInvite) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const existing = await prisma.user.findFirst({ where: { username: data.username } });
    if (existing) throw new ConflictException("A user with that username already exists.");
    const user = await prisma.user.create({
      data: {
        id: generateContentId(),
        secret: nanoid(),
        password: hashedPassword,
        username: data.username,
        invite: invite.id,
        permissions: invite.permissions,
      },
    });

    return user;
  }

  public checkPermissions(permissions: Permission | number, permission: Permission | number) {
    return (permissions & permission) === permission;
  }

  public addPermissions(permissions: Permission | number, permission: Permission | number) {
    permissions |= permission;
  }

  public clearPermissions(permissions: Permission | number, permission: Permission | number) {
    permissions &= ~permission;
  }
}
