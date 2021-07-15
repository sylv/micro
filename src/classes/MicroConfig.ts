import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsIn, IsNumber, IsOptional, IsString, IsUrl, NotEquals, ValidateNested } from "class-validator";
import fileType from "file-type";
import path from "path";
import xbytes from "xbytes";
import { MicroConfigPurge } from "./MicroConfigPurge";
import { MicroHost } from "./MicroHost";

export class MicroConfig {
  @IsUrl({ require_tld: false, require_protocol: true, protocols: ["postgresql", "postgres"] })
  database!: string;

  @IsString()
  @NotEquals("YOU_SHALL_NOT_PASS")
  secret!: string;

  @IsEmail()
  inquiries!: string;

  @IsNumber()
  @Transform(({ value }) => xbytes.parse(value).bytes)
  uploadLimit!: number;

  @IsString({ each: true })
  @IsIn(Array.from(fileType.mimeTypes.values()))
  @IsOptional()
  allowTypes?: string[];

  @IsString()
  @Transform(({ value }) => path.resolve(value))
  storagePath!: string;

  @IsBoolean()
  restrictFilesToHost!: boolean;

  @ValidateNested()
  @Type(() => MicroConfigPurge)
  @IsOptional()
  purge?: MicroConfigPurge;

  @ValidateNested({ each: true })
  @Type(() => MicroHost)
  hosts!: MicroHost[];

  get rootHost() {
    return this.hosts[0];
  }
}
