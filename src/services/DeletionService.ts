import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenAudience } from "../constants";
import { ContentType } from "../entities/base/Content";
import { FileService } from "./FileService";
import { LinkService } from "./LinkService";

export interface JWTPayloadDelete {
  type: ContentType;
  sub: string;
}

@Injectable()
export class DeletionService {
  constructor(private jwtService: JwtService, private fileService: FileService, private linkService: LinkService) {}

  async delete(token: string) {
    try {
      const payload = await this.verifyDeletionToken(token);
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

  getDeletionUrl(type: ContentType, id: string) {
    const token = this.signDeletionToken(type, id);
    return `/delete/${token}`;
  }

  signDeletionToken(type: ContentType, id: string): string {
    const payload: JWTPayloadDelete = { type, sub: id };
    return this.jwtService.sign(payload, {
      audience: TokenAudience.DELETION,
      expiresIn: "1y",
    });
  }

  async verifyDeletionToken(key: string): Promise<JWTPayloadDelete> {
    try {
      return await this.jwtService.verifyAsync<JWTPayloadDelete>(key, {
        audience: TokenAudience.DELETION,
      });
    } catch (e) {
      throw new BadRequestException("Token validation failed.");
    }
  }
}
