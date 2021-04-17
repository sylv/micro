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

  async useToken(token: string) {
    try {
      const payload = await this.verifyToken(token);
      switch (payload.type) {
        case ContentType.FILE:
          await this.fileService.deleteFile(payload.sub, undefined);
          break;
        case ContentType.LINK:
          await this.linkService.deleteLink(payload.sub, undefined);
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

  verifyToken(token: string) {
    return this.authService.verifyToken<JWTPayloadDelete>(TokenType.DELETION, token);
  }

  async createToken(type: ContentType, id: string) {
    const payload: JWTPayloadDelete = { type, sub: id };
    const token = await this.authService.signToken(TokenType.DELETION, payload);
    const url = `/delete/${token}`;
    return {
      token,
      url,
    };
  }
}
