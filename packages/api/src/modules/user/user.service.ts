import { EntityRepository, QueryOrder, UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import bcrypt from 'bcryptjs';
import dedent from 'dedent';
import handlebars from 'handlebars';
import ms from 'ms';
import { nanoid } from 'nanoid';
import { config } from '../../config.js';
import type { Permission } from '../../constants.js';
import { generateContentId } from '../../helpers/generate-content-id.helper.js';
import { sendMail } from '../../helpers/send-mail.helper.js';
import { File } from '../file/file.entity.js';
import type { Invite } from '../invite/invite.entity.js';
import { InviteService } from '../invite/invite.service.js';
import { Paste } from '../paste/paste.entity.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { Pagination } from './dto/pagination.dto.js';
import { UserVerification } from './user-verification.entity.js';
import { User } from './user.entity.js';

const EMAIL_TEMPLATE_SOURCE = dedent`
  <body>
  <h1>Verify Your Email</h1>
  <p>Thanks for signing up to micro. Click the link below to verify your email and activate your account.</p>
  <a href="{{verifyUrl}}">{{verifyUrl}}</a>
  <p><i>If you did not sign up for micro, ignore this email.</i></p>
`;

@Injectable()
export class UserService {
  private static readonly VERIFICATION_EXPIRY = ms('6 hours');
  private static readonly EMAIL_TEMPLATE = handlebars.compile<{ verifyUrl: string }>(EMAIL_TEMPLATE_SOURCE);

  constructor(
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    @InjectRepository(UserVerification) private readonly verificationRepo: EntityRepository<UserVerification>,
    @InjectRepository(File) private readonly fileRepo: EntityRepository<File>,
    @InjectRepository(Paste) private readonly pasteRepo: EntityRepository<Paste>,
    private readonly inviteService: InviteService
  ) {}

  async getUser(id: string, verified: boolean) {
    const user = await this.userRepo.findOneOrFail(id);
    if (verified && config.email && !user.verifiedEmail) {
      throw new ForbiddenException('You must verify your email first.');
    }

    return user;
  }

  getUserFiles(userId: string, pagination: Pagination) {
    return this.fileRepo.find(
      {
        owner: userId,
      },
      {
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: {
          createdAt: QueryOrder.DESC,
        },
      }
    );
  }

  getUserPastes(userId: string, pagination: Pagination) {
    return this.pasteRepo.find(
      {
        owner: userId,
      },
      {
        limit: pagination.limit,
        offset: pagination.offset,
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

  checkPermissions(permissions: Permission | number, permission: Permission | number) {
    return (permissions & permission) === permission;
  }

  addPermissions(permissions: Permission | number, permission: Permission | number) {
    permissions |= permission;
  }

  clearPermissions(permissions: Permission | number, permission: Permission | number) {
    permissions &= ~permission;
  }

  /**
   * @warning you must persist the user on your own after calling this
   */
  async sendVerificationEmail(user: User) {
    if (!user.email) {
      throw new BadRequestException('User has no email address');
    }

    const verification = this.verificationRepo.create({
      user: user,
      expiresAt: new Date(Date.now() + UserService.VERIFICATION_EXPIRY),
    });

    user.verifications.add(verification);
    const verifyUrl = `${config.rootHost.url}/api/user/${verification.user.id}/verify/${verification.id}`;
    const html = UserService.EMAIL_TEMPLATE({ verifyUrl });
    await sendMail({
      to: verification.user.email,
      subject: 'Verify your account | micro',
      html: html,
    });
  }

  async createUser(data: CreateUserDto, invite: Invite) {
    if (!data.email && config.email) {
      throw new ConflictException('You must provide an email address to create a user.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
      id: generateContentId(),
      secret: nanoid(),
      email: data.email,
      password: hashedPassword,
      username: data.username,
      invite: invite.id,
      permissions: invite.permissions ?? 0,
      otpEnabled: false,
    });

    if (data.email) {
      await this.checkEmail(data.email);
      await this.sendVerificationEmail(user);
    }

    try {
      await this.inviteService.consume(invite);
      await this.userRepo.persistAndFlush(user);
      return user;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException('Username or email already exists');
      }

      throw error;
    }
  }

  async verifyUser(userId: string, verificationId: string) {
    const verification = await this.verificationRepo.findOne(
      {
        user: userId,
        id: verificationId,
        expiresAt: {
          $gt: new Date(),
        },
      },
      { populate: ['user'] }
    );

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    verification.user.verifiedEmail = true;
    await this.userRepo.persistAndFlush(verification.user);
    await this.verificationRepo.nativeDelete({
      user: userId,
    });
  }

  async checkEmail(email: string) {
    const existingByLowerEmail = await this.userRepo.findOne({
      email: {
        $ilike: email.toLowerCase(),
      },
    });

    if (existingByLowerEmail) {
      throw new ConflictException('Username or email already exists.');
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteExpiredVerifications() {
    await this.verificationRepo.nativeDelete({
      expiresAt: {
        $lt: new Date(),
      },
    });
  }
}
