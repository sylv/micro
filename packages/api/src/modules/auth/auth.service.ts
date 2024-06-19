import { EntityManager } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import crypto, { randomUUID } from "crypto";
import { authenticator } from "otplib";
import { UserEntity } from "../user/user.entity.js";
import { AccountDisabledError } from "./account-disabled.error.js";

export enum TokenType {
  USER = "USER",
  DELETION = "DELETION",
  INVITE = "INVITE",
}

interface TokenPayload {
  aud: TokenType;
  exp: number;
  iat: number;
}

@ObjectType()
export class PendingOTP {
  @Field()
  secret: string;

  @Field(() => [String])
  recoveryCodes: string[];

  @Field()
  qrauthUrl: string;
}

@ArgsType()
export class ConfirmedOTP {
  @Field()
  code: string;

  @Field()
  secret: string;

  @Field(() => [String])
  recoveryCodes: string[];
}

const NUMBER_REGEX = /^\d{6}$/u;

@Injectable()
export class AuthService {
  @InjectRepository(UserEntity) private userRepo: EntityRepository<UserEntity>;

  constructor(
    private jwtService: JwtService,
    private readonly em: EntityManager,
  ) {}

  signToken<PayloadType extends Record<string, any>>(
    type: TokenType,
    payload: PayloadType,
    expiresIn = "1y",
  ) {
    return this.jwtService.signAsync(payload, {
      audience: type,
      expiresIn: expiresIn,
    });
  }

  async verifyToken<Payload extends Record<string, any>>(
    type: TokenType,
    token: string,
  ): Promise<Payload & TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<Payload & TokenPayload>(token, {
        audience: type,
      });
    } catch {
      throw new BadRequestException("Token validation failed.");
    }
  }

  /**
   * Authenticaet a user by username and password.
   */
  async authenticateUser(username: string, password: string, otpCode?: string) {
    const user = await this.userRepo.findOne({
      $or: [{ username }, { email: { $ilike: username } }],
    });

    if (!user) throw new UnauthorizedException();
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    if (user.otpEnabled) {
      // account has otp enabled, check if the code is valid
      await this.validateOTPCode(otpCode, user);
    }

    if (user.disabledReason) {
      throw new AccountDisabledError(user.disabledReason);
    }

    return user;
  }

  /**
   * Generates an OTP configuration for a user
   * Doesn't enable OTP or even persist it to the user until confirmOTP()
   */
  generateOTP(user: UserEntity): PendingOTP {
    if (user.otpEnabled) {
      throw new UnauthorizedException("User already has OTP enabled.");
    }

    const otpSecret = authenticator.generateSecret();
    const recoveryCodes = [];
    for (let i = 0; i < 8; i++) {
      recoveryCodes.push(randomUUID());
    }

    return {
      recoveryCodes,
      secret: otpSecret,
      qrauthUrl: authenticator.keyuri(user.username, "Micro", otpSecret),
    };
  }

  /**
   * Enable OTP after the user has verified the code.
   * Start by calling generateOTP() to get the code.
   */
  async confirmOTP(user: UserEntity, confirmation: ConfirmedOTP) {
    if (user.otpEnabled) {
      throw new UnauthorizedException("User already has OTP enabled.");
    }

    const isValid = authenticator.check(confirmation.code, confirmation.secret);
    if (!isValid) {
      throw new UnauthorizedException("Invalid OTP code");
    }

    user.otpEnabled = true;
    user.otpSecret = confirmation.secret;
    user.otpRecoveryCodes = confirmation.recoveryCodes.map((code) => {
      return crypto.createHash("sha256").update(code).digest("hex");
    });

    await this.em.persistAndFlush(user);
  }

  /**
   * Disable OTP for a user.
   * @param otpCode Either a recovery code or an OTP code.
   */
  async disableOTP(user: UserEntity, otpCode: string) {
    await this.validateOTPCode(otpCode, user);
    user.otpSecret = undefined;
    user.otpRecoveryCodes = undefined;
    user.otpEnabled = false;
    await this.em.persistAndFlush(user);
  }

  /**
   * Validate an OTP code for a user.
   * Supports recovery codes.g
   * @throws if the user does not have OTP enabled, check beforehand.
   */
  private async validateOTPCode(otpCode: string | undefined, user: UserEntity) {
    if (!user.otpEnabled || !user.otpSecret) {
      throw new Error("User does not have OTP enabled.");
    }

    if (!otpCode) {
      throw new UnauthorizedException("OTP code is required.");
    }

    if (this.isOTPCode(otpCode)) {
      // user gave us an otp code
      const isValid = authenticator.check(otpCode, user.otpSecret);
      if (!isValid) {
        throw new UnauthorizedException("Invalid OTP code.");
      }
    } else {
      // user likely gave us a recovery code, or garbage
      const hashedRecoveryCode = crypto.createHash("sha256").update(otpCode.toLowerCase()).digest("hex");
      if (!user.otpRecoveryCodes) {
        throw new Error("User has no recovery codes.");
      }

      const codeIndex = user.otpRecoveryCodes.indexOf(hashedRecoveryCode);
      if (codeIndex === -1) {
        throw new UnauthorizedException("Invalid or already used recovery code.");
      }

      // remove recovery code
      user.otpRecoveryCodes.splice(codeIndex, 1);
      await this.em.persistAndFlush(user);
    }
  }

  /**
   * Determine if the input is numeric OTP code or not.
   * Usually if this is false, the code will be a recovery code. Or garbage.
   */
  private isOTPCode(input: string) {
    return NUMBER_REGEX.test(input);
  }
}
