import { EntityManager } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import type { EntityRepository } from "@mikro-orm/postgresql";
import { Controller, Delete, ForbiddenException, Get, Param, Response } from "@nestjs/common";
import { type FastifyReply } from "fastify";
import { config, rootHost } from "../../config.js";
import { Permission } from "../../constants.js";
import { RequirePermissions, UserId } from "../auth/auth.decorators.js";
import { FileEntity } from "../file/file.entity.js";
import { LinkEntity } from "../link/link.entity.js";
import { StorageService } from "../storage/storage.service.js";
import { UserService } from "./user.service.js";
import { PasteEntity } from "../paste/paste.entity.js";
import { UserEntity } from "./user.entity.js";

@Controller()
export class UserController {
  @InjectRepository(FileEntity) private fileRepo: EntityRepository<FileEntity>;
  @InjectRepository(LinkEntity) private linkRepo: EntityRepository<LinkEntity>;
  @InjectRepository(PasteEntity) private pasteRepo: EntityRepository<PasteEntity>;
  @InjectRepository(UserEntity) private userRepo: EntityRepository<UserEntity>;

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private em: EntityManager,
  ) {}

  @Get("user/:userId/verify/:verifyId")
  async verifyUser(
    @Param("userId") userId: string,
    @Param("verifyId") verifyId: string,
    @Response() reply: FastifyReply,
  ) {
    await this.userService.verifyUser(userId, verifyId);
    return reply.redirect(302, rootHost.url + "/login?verified=true");
  }

  @Delete("user/:userId/delete_yes_im_really_sure")
  @RequirePermissions(Permission.DELETE_USERS)
  async deleteUser(@Param("userId") userId: string, @UserId() adminId: string) {
    if (!config.deleteUsersEnabled) {
      // this is not a well thought out feature and is just a bandaid fix to respect
      // users privacy. in the future i'm going to implement something more serious.
      // until then, i dont want this running in prod unless necessary.
      throw new ForbiddenException("User deletion is disabled");
    }

    let filesDeleted = 0;
    while (true) {
      const file = await this.fileRepo.findOne({
        owner: userId,
      });

      if (!file) break;
      await this.storageService.delete(file);
      await this.em.removeAndFlush(file);
      filesDeleted++;
    }

    const pastesDeleted = await this.pasteRepo.nativeDelete({ owner: userId });
    const linksDeleted = await this.linkRepo.nativeDelete({ owner: userId });
    const userDeleted = await this.userRepo.nativeDelete({ id: userId });

    return {
      success: true,
      message: "User deleted",
      stats: {
        filesDeleted,
        pastesDeleted,
        linksDeleted,
        userDeleted,
      },
    };
  }
}
