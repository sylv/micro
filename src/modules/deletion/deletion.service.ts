import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuthService, TokenType } from "../auth/auth.service";
import { FileService } from "../file/file.service";
import { LinkService } from "../link/link.service";

export interface JWTPayloadDelete {
  type: ContentType;
  sub: string;
}

export enum ContentType {
  FILE,
  LINK,
}

@Injectable()
export class DeletionService {
  constructor(private authService: AuthService, private fileService: FileService, private linkService: LinkService) {}

  async use(token: string) {
    try {
      const payload = await this.verify(token);
      switch (payload.type) {
        case ContentType.FILE:
          await this.fileService.delete(payload.sub, undefined);
          break;
        case ContentType.LINK:
          await this.linkService.delete(payload.sub, undefined);
          break;
        default:
          throw new BadRequestException("Unknown deletion type.");
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new BadRequestException("That content has already been deleted.");
      }

      throw e;
    }
  }

  verify(token: string) {
    return this.authService.verifyToken<JWTPayloadDelete>(TokenType.DELETION, token);
  }

  async create(type: ContentType, id: string) {
    const payload: JWTPayloadDelete = { type, sub: id };
    const token = await this.authService.signToken(TokenType.DELETION, payload);
    const url = `/delete/${token}`;
    return {
      token,
      url,
    };
  }
}
