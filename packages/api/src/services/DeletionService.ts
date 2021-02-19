import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getRepository } from "typeorm";
import { config } from "../config";
import { ContentType } from "../entities/base/Content";
import { File } from "../entities/File";
import { Link } from "../entities/Link";
import { TokenAudience } from "../types";
import { FileService } from "./FileService";
import { formatUrl } from "../helpers/formatUrl";

export interface JWTPayloadDelete {
  type: ContentType;
  sub: string;
}

@Injectable()
export class DeletionService {
  constructor(protected jwtService: JwtService, protected fileService: FileService) {}

  async delete(token: string) {
    const payload = await this.verifyDeletionToken(token);
    const repo = payload.type == ContentType.FILE ? getRepository(File) : getRepository(Link);
    const count = await repo.delete(payload.sub);
    if (count.affected! === 0) throw new NotFoundException();
    return;
  }

  getDeletionUrl(type: ContentType, id: string) {
    const token = this.signDeletionToken(type, id);
    return formatUrl(config.host, `/delete/${token}`);
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
