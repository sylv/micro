import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getRepository } from "typeorm";
import { ContentType } from "../entities/base/Content";
import { File } from "../entities/File";
import { Link } from "../entities/Link";
import { TokenAudience } from "../types";
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

  verifyDeletionToken(key: string): Promise<JWTPayloadDelete> {
    return this.jwtService.verifyAsync<JWTPayloadDelete>(key, {
      audience: TokenAudience.DELETION,
    });
  }
}
