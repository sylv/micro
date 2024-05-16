import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { authenticator } from "otplib";
import { UserEntity } from "../user/user.entity.js";
import type { OTPEnabledDto } from "./dto/otp-enabled.dto.js";
import { AccountDisabledError } from "./account-disabled.error.js";
import { EntityManager } from "@mikro-orm/core";

export enum TokenType {
  USER = "USER",
  DELETION = "DELETION",
  INVITE = "INVITE",
}

export interface TokenPayload {
  aud: TokenType;
  exp: number;
  iat: number;
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
   * Adds OTP codes to a user, without enabling OTP.
   * This is the first step in enabling OTP, next will be to get the user to verify the code using enableOTP().
   */
  async generateOTP(user: UserEntity): Promise<OTPEnabledDto> {
    if (user.otpEnabled) {
      throw new UnauthorizedException("User already has OTP enabled.");
    }

    const recoveryCodes = [];
    user.otpSecret = authenticator.generateSecret();
    user.otpRecoveryCodes = [];
    for (let i = 0; i < 8; i++) {
      const code = crypto
        .randomBytes(8)
        .toString("hex")
        .match(/.{1,4}/gu)!
        .join("-");
      const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
      user.otpRecoveryCodes.push(hashedCode);
      recoveryCodes.push(code);
    }

    await this.em.persistAndFlush(user);
    return {
      recoveryCodes,
      secret: user.otpSecret,
      qrauthUrl: authenticator.keyuri(user.username, "Micro", user.otpSecret),
    };
  }

  /**
   * Enable OTP after the user has verified the code.
   * Start by calling generateOTP() to get the code.
   */
  async confirmOTP(user: UserEntity, otpCode: string) {
    if (user.otpEnabled) {
      throw new UnauthorizedException("User already has OTP enabled.");
    }

    if (!user.otpSecret || !user.otpRecoveryCodes || !user.otpRecoveryCodes[0]) {
      throw new Error("User does not have 2FA codes.");
    }

    user.otpEnabled = true;
    await this.validateOTPCode(otpCode, user);
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
