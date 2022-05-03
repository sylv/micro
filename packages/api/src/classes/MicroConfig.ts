import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  NotEquals,
  ValidateNested,
} from "class-validator";
import fileType from "file-type";
import path from "path";
import xbytes from "xbytes";
import { MicroConfigPurge } from "./MicroConfigPurge";
import { MicroHost } from "./MicroHost";

export class MicroConfig {
  @IsUrl({ require_tld: false, require_protocol: true, protocols: ["postgresql", "postgres"] })
  databaseUrl!: string;

  @IsString()
  @NotEquals("YOU_SHALL_NOT_PASS")
  secret!: string;

  @IsEmail()
  inquiries!: string;

  @IsNumber()
  @Transform(({ value }) => xbytes.parseSize(value))
  uploadLimit = xbytes.parseSize("50MB");

  @IsString({ each: true })
  @IsIn([...fileType.mimeTypes.values()])
  @IsOptional()
  allowTypes?: string[];

  @IsString()
  @Transform(({ value }) => path.resolve(value))
  storagePath!: string;

  @IsBoolean()
  restrictFilesToHost!: boolean;

  @ValidateNested()
  @IsOptional()
  @Type(() => MicroConfigPurge)
  purge?: MicroConfigPurge;

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => MicroHost)
  hosts!: MicroHost[];

  get rootHost() {
    return this.hosts[0];
  }
}
