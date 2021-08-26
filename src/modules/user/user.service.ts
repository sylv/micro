import { ConflictException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Permission } from "../../constants";
import { generateContentId } from "../../helpers/generate-content-id.helper";
import { prisma } from "../../prisma";
import { JWTPayloadInvite } from "../invite/invite.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserFilesQueryDto } from "./dto/user-files-query.dto";

@Injectable()
export class UserService {
  getUser(id: string, secret = false) {
    return prisma.user.findFirst({
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
  }

  getUserFiles(userId: string, dto?: UserFilesQueryDto) {
    return prisma.file.findMany({
      take: dto?.take ?? 24,
      skip: dto?.cursor ? 1 : 0,
      cursor: dto?.cursor ? { id: dto.cursor } : undefined,
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

  checkPermissions(permissions: Permission | number, permission: Permission | number) {
    return (permissions & permission) === permission;
  }

  addPermissions(permissions: Permission | number, permission: Permission | number) {
    permissions |= permission;
  }

  clearPermissions(permissions: Permission | number, permission: Permission | number) {
    permissions &= ~permission;
  }
}
