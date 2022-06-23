/* eslint-disable sonarjs/no-duplicate-string */
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Permission } from '../../constants';
import { RequirePermissions, UserId } from '../auth/auth.decorators';
import { AuthService, TokenType } from '../auth/auth.service';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import type { JWTPayloadUser } from '../auth/strategies/jwt.strategy';
import { InviteService } from '../invite/invite.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Pagination } from './dto/pagination.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    private readonly userService: UserService,
    private readonly inviteService: InviteService,
    private readonly authService: AuthService
  ) {}

  @Get('user')
  @UseGuards(JWTAuthGuard)
  async getUser(@UserId() userId: string) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new ForbiddenException('Unknown user.');
    return user;
  }

  @Post('user')
  async createUser(@Body() data: CreateUserDto) {
    const invite = await this.inviteService.get(data.invite);
    if (!invite) throw new UnauthorizedException('Invalid invite.');
    return this.userService.createUser(data, invite);
  }

  @Get('user/files')
  @UseGuards(JWTAuthGuard)
  async getUserFiles(@UserId() userId: string, @Query() pagination: Pagination) {
    return this.userService.getUserFiles(userId, pagination);
  }

  @Get('user/token')
  @UseGuards(JWTAuthGuard)
  async getUserToken(@UserId() userId: string) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new ForbiddenException('Unknown user.');
    const token = await this.authService.signToken<JWTPayloadUser>(TokenType.USER, {
      name: user.username,
      secret: user.secret,
      id: user.id,
    });

    return { token };
  }

  @Put('user/token')
  @UseGuards(JWTAuthGuard)
  async resetUserToken(@UserId() userId: string) {
    const secret = nanoid();
    const reference = this.userRepo.getReference(userId);
    reference.secret = secret;
    await this.userRepo.persistAndFlush(reference);
    return this.getUserToken(userId);
  }

  // temporary until admin UI
  @Get('user/:id/delete')
  @RequirePermissions(Permission.DELETE_USERS)
  @UseGuards(JWTAuthGuard)
  async deleteUser(@Param('id') targetId: string) {
    const target = await this.userService.getUser(targetId);
    if (!target) throw new BadRequestException('Unknown target.');
    if (this.userService.checkPermissions(target.permissions, Permission.ADMINISTRATOR)) {
      throw new ForbiddenException("You can't do that to that user.");
    }

    await this.userService.deleteUser(targetId);
    return { deleted: true };
  }

  // temporary until admin UI
  @Get('user/:id/tags/add/:tag')
  @RequirePermissions(Permission.ADD_USER_TAGS)
  @UseGuards(JWTAuthGuard)
  async addTagToUser(@Param('id') targetId: string, @Param('tag') tag: string) {
    const target = await this.userService.getUser(targetId);
    if (!target) throw new BadRequestException('Unknown target.');
    if (target.tags.includes(tag.toLowerCase())) {
      throw new BadRequestException('User already has that tag.');
    }

    target.tags.push(tag.toLowerCase());
    return { added: true, tag };
  }

  // temporary until admin UI
  @Get('user/:id/tags/remove/:tag')
  @RequirePermissions(Permission.ADD_USER_TAGS)
  @UseGuards(JWTAuthGuard)
  async removeTagFromUser(@Param('id') targetId: string, @Param('tag') tag: string) {
    const target = await this.userService.getUser(targetId);
    if (!target) throw new BadRequestException('Unknown target.');
    if (!target.tags.includes(tag)) {
      throw new BadRequestException('User does not have that tag.');
    }

    target.tags = target.tags.filter((existing) => existing !== tag);
    return { removed: true, tag };
  }
}
