import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import ms from 'ms';
import { nanoid } from 'nanoid';
import { paginate, parseCursor } from '../../helpers/pagination';
import { UserId } from '../auth/auth.decorators';
import { AuthService, TokenType } from '../auth/auth.service';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import type { JWTPayloadUser } from '../auth/strategies/jwt.strategy';
import { File, FilePage } from '../file/file.entity';
import { InviteService } from '../invite/invite.service';
import { Paste, PastePage } from '../paste/paste.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { UserVerification } from './user-verification.entity';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  private static readonly MIN_RESEND_INTERVAL = ms('5m');

  constructor(
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    @InjectRepository(File) private readonly fileRepo: EntityRepository<File>,
    @InjectRepository(Paste) private readonly pasteRepo: EntityRepository<Paste>,
    @InjectRepository(UserVerification) private readonly verificationRepo: EntityRepository<UserVerification>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly inviteService: InviteService
  ) {}

  @Query(() => User)
  @UseGuards(JWTAuthGuard)
  async user(@UserId() userId: string) {
    return this.userRepo.findOneOrFail(userId);
  }

  @ResolveField(() => Number)
  async aggregateFileSize(@UserId() userId: string, @Parent() user: User) {
    if (userId !== user.id) throw new UnauthorizedException();
    const result = await this.fileRepo.createQueryBuilder().where({ owner: user.id }).getKnex().sum('size').first();
    return Number(result.sum);
  }

  @ResolveField(() => FilePage)
  async files(
    @UserId() userId: string,
    @Parent() user: User,
    @Args('first', { nullable: true }) limit: number = 0,
    @Args('after', { nullable: true }) cursor?: string
  ): Promise<FilePage> {
    if (userId !== user.id) throw new UnauthorizedException();
    if (limit > 100) limit = 100;
    if (limit <= 0) limit = 10;
    const query: FilterQuery<File> = { owner: user.id };
    const offset = cursor ? parseCursor(cursor) : 0;
    const [files, count] = await this.fileRepo.findAndCount(query, {
      offset: offset,
      limit: limit,
      orderBy: {
        createdAt: 'DESC',
      },
    });

    return paginate(files, count, offset);
  }

  @ResolveField(() => PastePage)
  async pastes(
    @UserId() userId: string,
    @Parent() user: User,
    @Args('first', { nullable: true }) limit: number = 0,
    @Args('after', { nullable: true }) cursor?: string
  ): Promise<PastePage> {
    if (userId !== user.id) throw new UnauthorizedException();
    if (limit > 100) limit = 100;
    if (limit <= 0) limit = 10;
    const query: FilterQuery<Paste> = { owner: user.id };
    const offset = cursor ? parseCursor(cursor) : 0;
    const [pastes, count] = await this.pasteRepo.findAndCount(query, {
      offset: offset,
      limit: limit,
      orderBy: {
        createdAt: 'DESC',
      },
    });

    return paginate(pastes, count, offset);
  }

  @ResolveField(() => String)
  async token(@UserId() userId: string, @Parent() user: User) {
    if (userId !== user.id) throw new UnauthorizedException();
    return this.authService.signToken<JWTPayloadUser>(TokenType.USER, {
      name: user.username,
      secret: user.secret,
      id: user.id,
    });
  }

  @Mutation(() => User)
  @UseGuards(JWTAuthGuard)
  async refreshToken(@UserId() userId: string) {
    const secret = nanoid();
    const user = await this.userRepo.findOneOrFail(userId);
    user.secret = secret;
    await this.userRepo.persistAndFlush(user);
    return user;
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDto) {
    const invite = await this.inviteService.get(data.invite);
    if (!invite) throw new UnauthorizedException('Invalid invite.');
    return this.userService.createUser(data, invite);
  }

  @Mutation(() => Boolean)
  @UseGuards(JWTAuthGuard)
  async resendVerificationEmail(
    @UserId() userId: string,
    @Args('data', { nullable: true }) body?: ResendVerificationEmailDto
  ) {
    const user = await this.userService.getUser(userId, false);
    const latestVerification = await this.verificationRepo.findOne(
      {
        user: userId,
        expiresAt: {
          $gt: new Date(),
        },
      },
      {
        orderBy: {
          expiresAt: 'DESC',
        },
      }
    );

    if (latestVerification && latestVerification.expiresAt.getTime() > Date.now() + UserResolver.MIN_RESEND_INTERVAL) {
      throw new BadRequestException('You can only send a verification email every 5 minutes.');
    }

    if (body?.email) {
      if (user.email) {
        throw new BadRequestException('User already has an email address');
      }

      await this.userService.checkEmail(body.email);
      user.email = body.email;
    }

    await this.userService.sendVerificationEmail(user);
    await this.userRepo.persistAndFlush(user);
    return true;
  }
}
