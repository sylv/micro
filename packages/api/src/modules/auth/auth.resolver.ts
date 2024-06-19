import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { FastifyReply } from "fastify";
import ms from "ms";
import { rootHost } from "../../config.js";
import { UserEntity } from "../user/user.entity.js";
import { UserId } from "./auth.decorators.js";
import { AuthService, PendingOTP, TokenType } from "./auth.service.js";
import { JWTAuthGuard } from "./guards/jwt.guard.js";
import type { JWTPayloadUser } from "./strategies/jwt.strategy.js";

@Resolver(() => UserEntity)
export class AuthResolver {
  @InjectRepository(UserEntity) private userRepo: EntityRepository<UserEntity>;

  private static readonly ONE_YEAR = ms("1y");
  private static readonly COOKIE_OPTIONS = {
    path: "/",
    httpOnly: true,
    domain: rootHost.normalised.split(":").shift(),
    secure: rootHost.url.startsWith("https"),
  };

  constructor(private authService: AuthService) {}

  @Mutation(() => UserEntity)
  async login(
    @Context() ctx: any,
    @Args("username") username: string,
    @Args("password") password: string,
    @Args("otpCode", { nullable: true }) otpCode?: string,
  ) {
    const reply = ctx.reply as FastifyReply;
    const user = await this.authService.authenticateUser(username, password, otpCode);
    const payload: JWTPayloadUser = { name: user.username, id: user.id, secret: user.secret };
    const expiresAt = Date.now() + AuthResolver.ONE_YEAR;
    const token = await this.authService.signToken<JWTPayloadUser>(TokenType.USER, payload, "1y");
    void reply.setCookie("token", token, {
      ...AuthResolver.COOKIE_OPTIONS,
      expires: new Date(expiresAt),
    });

    // fixes querying things like user.token, which requires req.user to match the query user
    ctx.req.user = user;
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: any) {
    const reply = ctx.reply as FastifyReply;
    void reply.setCookie("token", "", {
      ...AuthResolver.COOKIE_OPTIONS,
      expires: new Date(),
    });

    return true;
  }

  @Query(() => PendingOTP)
  @UseGuards(JWTAuthGuard)
  async generateOTP(@UserId() userId: string) {
    const user = await this.userRepo.findOneOrFail(userId);
    return this.authService.generateOTP(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JWTAuthGuard)
  async confirmOTP(
    @UserId() userId: string,
    @Args({ name: "secret", type: () => String }) secret: string,
    @Args({ name: "code", type: () => String }) code: string,
    @Args({ name: "recoveryCodes", type: () => [String] }) recoveryCodes: string[],
  ) {
    const user = await this.userRepo.findOneOrFail(userId);
    await this.authService.confirmOTP(user, { code, recoveryCodes, secret });
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JWTAuthGuard)
  async disableOTP(@UserId() userId: string, @Args("otpCode") otpCode: string) {
    const user = await this.userRepo.findOneOrFail(userId);
    await this.authService.disableOTP(user, otpCode);
    return true;
  }
}
