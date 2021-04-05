import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Permission } from "../../constants";
import { shortId } from "../../helpers/shortId";
import { prisma } from "../../prisma";
import { JWTPayloadInvite } from "../invite/invite.service";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  async get(id: string) {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        invite: true,
        permissions: true,
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }

  getFiles(userId: string, cursor?: string) {
    return prisma.file.findMany({
      take: 24,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      where: {
        ownerId: userId,
      },
    });
  }

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async create(username: string, password: string, invite: JWTPayloadInvite) {
    const lowerUsername = username.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const existing = await prisma.user.findFirst({ where: { username: lowerUsername } });
    if (existing) throw new ConflictException("A user with that username already exists.");
    const user = await prisma.user.create({
      data: {
        id: shortId(),
        token: nanoid(64),
        password: hashedPassword,
        username: lowerUsername,
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
