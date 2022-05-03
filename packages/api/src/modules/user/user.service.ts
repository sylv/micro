import { EntityRepository, QueryOrder } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { ConflictException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Permission } from "../../constants";
import { generateContentId } from "../../helpers/generate-content-id.helper";
import { File } from "../file/file.entity";
import { Invite } from "../invite/invite.entity";
import { InviteService } from "../invite/invite.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Pagination } from "./dto/pagination.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: EntityRepository<User>,
    @InjectRepository(File) private fileRepo: EntityRepository<File>,
    private inviteService: InviteService
  ) {}

  getUser(id: string) {
    return this.userRepo.findOne(id);
  }

  getUserFiles(userId: string, pagination: Pagination) {
    return this.fileRepo.find(
      {
        owner: userId,
      },
      {
        limit: pagination.limit,
        orderBy: {
          createdAt: QueryOrder.DESC,
        },
      }
    );
  }

  async deleteUser(id: string) {
    const user = this.userRepo.getReference(id);
    await this.userRepo.removeAndFlush(user);
  }

  async createUser(data: CreateUserDto, invite: Invite) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const existing = await this.userRepo.findOne({ username: data.username });
    if (existing) throw new ConflictException("A user with that username already exists.");
    const user = this.userRepo.create({
      id: generateContentId(),
      secret: nanoid(),
      password: hashedPassword,
      username: data.username,
      invite: invite.id,
      permissions: invite.permissions,
    });

    await this.inviteService.consume(invite);
    await this.userRepo.persistAndFlush(user);
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
