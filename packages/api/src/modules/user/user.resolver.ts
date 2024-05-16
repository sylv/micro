import { EntityManager, type FilterQuery } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import ms from "ms";
import { nanoid } from "nanoid";
import { paginate, parseCursor } from "../../helpers/pagination.js";
import { UserId } from "../auth/auth.decorators.js";
import { AuthService, TokenType } from "../auth/auth.service.js";
import { JWTAuthGuard } from "../auth/guards/jwt.guard.js";
import type { JWTPayloadUser } from "../auth/strategies/jwt.strategy.js";
import { FileEntity, FilePage } from "../file/file.entity.js";
import { InviteService } from "../invite/invite.service.js";
import { PasteEntity, PastePage } from "../paste/paste.entity.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { ResendVerificationEmailDto } from "./dto/resend-verification-email.dto.js";
import { UserVerificationEntity } from "./user-verification.entity.js";
import { UserEntity } from "./user.entity.js";
import { UserService } from "./user.service.js";

@Resolver(() => UserEntity)
export class UserResolver {
  @InjectRepository(UserEntity) private userRepo: EntityRepository<UserEntity>;
  @InjectRepository(FileEntity) private fileRepo: EntityRepository<FileEntity>;
  @InjectRepository(PasteEntity) private pasteRepo: EntityRepository<PasteEntity>;
  @InjectRepository(UserVerificationEntity)
  private verificationRepo: EntityRepository<UserVerificationEntity>;

  private static readonly MIN_RESEND_INTERVAL = ms("5m");

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private inviteService: InviteService,
    private readonly em: EntityManager,
  ) {}

  @Query(() => UserEntity)
  @UseGuards(JWTAuthGuard)
  async user(@UserId() userId: string) {
    return this.userRepo.findOneOrFail(userId);
  }

  @ResolveField(() => Number)
  async aggregateFileSize(@UserId() userId: string, @Parent() user: UserEntity) {
    if (userId !== user.id) throw new UnauthorizedException();
    const result = await this.fileRepo
      .createQueryBuilder()
      .where({ owner: user.id })
      .getKnex()
      .sum("size")
      .first();
    return Number(result.sum);
  }

  @ResolveField(() => FilePage)
  async files(
    @UserId() userId: string,
    @Parent() user: UserEntity,
    @Args("first", { nullable: true }) limit: number = 0,
    @Args("after", { nullable: true }) cursor?: string,
  ): Promise<FilePage> {
    if (userId !== user.id) throw new UnauthorizedException();
    if (limit > 100) limit = 100;
    if (limit <= 0) limit = 10;
    const query: FilterQuery<FileEntity> = { owner: user.id };
    const offset = cursor ? parseCursor(cursor) : 0;
    const [files, count] = await this.fileRepo.findAndCount(query, {
      offset: offset,
      limit: limit,
      orderBy: {
        createdAt: "DESC",
      },
    });

    return paginate(files, count, offset);
  }

  @ResolveField(() => PastePage)
  async pastes(
    @UserId() userId: string,
    @Parent() user: UserEntity,
    @Args("first", { nullable: true }) limit: number = 0,
    @Args("after", { nullable: true }) cursor?: string,
  ): Promise<PastePage> {
    if (userId !== user.id) throw new UnauthorizedException();
    if (limit > 100) limit = 100;
    if (limit <= 0) limit = 10;
    const query: FilterQuery<PasteEntity> = { owner: user.id };
    const offset = cursor ? parseCursor(cursor) : 0;
    const [pastes, count] = await this.pasteRepo.findAndCount(query, {
      offset: offset,
      limit: limit,
      orderBy: {
        createdAt: "DESC",
      },
    });

    return paginate(pastes, count, offset);
  }

  @ResolveField(() => String)
  async token(@UserId() userId: string, @Parent() user: UserEntity) {
    if (userId !== user.id) throw new UnauthorizedException();
    return this.authService.signToken<JWTPayloadUser>(TokenType.USER, {
      name: user.username,
      secret: user.secret,
      id: user.id,
    });
  }

  @Mutation(() => UserEntity)
  @UseGuards(JWTAuthGuard)
  async refreshToken(@UserId() userId: string) {
    const secret = nanoid();
    const user = await this.userRepo.findOneOrFail(userId);
    user.secret = secret;
    await this.em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserEntity)
  async createUser(@Args("data") data: CreateUserDto) {
    const invite = await this.inviteService.get(data.invite);
    if (!invite) throw new UnauthorizedException("Invalid invite.");
    return this.userService.createUser(data, invite);
  }

  @Mutation(() => Boolean)
  @UseGuards(JWTAuthGuard)
  async changePassword(
    @UserId() userId: string,
    @Args("currentPassword") currentPassword: string,
    @Args("newPassword") newPassword: string,
  ) {
    await this.userService.changePassword(userId, currentPassword, newPassword);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JWTAuthGuard)
  async resendVerificationEmail(
    @UserId() userId: string,
    @Args("data", { nullable: true }) body?: ResendVerificationEmailDto,
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
          expiresAt: "DESC",
        },
      },
    );

    if (
      latestVerification &&
      latestVerification.expiresAt.getTime() > Date.now() + UserResolver.MIN_RESEND_INTERVAL
    ) {
      throw new BadRequestException("You can only send a verification email every 5 minutes.");
    }

    if (body?.email) {
      if (user.email) {
        throw new BadRequestException("User already has an email address");
      }

      await this.userService.checkEmail(body.email);
      user.email = body.email;
    }

    await this.userService.sendVerificationEmail(user);
    await this.em.persistAndFlush(user);
    return true;
  }
}
