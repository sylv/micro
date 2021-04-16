import { Transform, Type } from "class-transformer";
import { IsEmail, IsIn, IsNotIn, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import fileType from "file-type";
import path from "path";
import xbytes from "xbytes";
import { MicroHost } from "./MicroHost";

export class MicroConfig {
  @IsUrl({ require_tld: false, require_protocol: true, protocols: ["postgresql", "postgres"] })
  database!: string;

  @IsString()
  @IsNotIn(["YOU_SHALL_NOT_PASS"])
  secret!: string;

  @IsEmail()
  inquiries!: string;

  @IsNumber()
  @Transform(({ value }) => xbytes.parse(value).bytes)
  uploadLimit!: number;

  @IsString({ each: true })
  @IsIn(fileType.mimeTypes)
  @IsOptional()
  allowTypes?: string[];

  @IsString()
  @Transform(({ value }) => path.resolve(value))
  storagePath!: string;

  @ValidateNested({ each: true })
  @Type(() => MicroHost)
  hosts!: MicroHost[];
}
