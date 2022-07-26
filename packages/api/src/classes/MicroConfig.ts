import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsMimeType,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import path from 'path';
import xbytes from 'xbytes';
import { expandMime } from '../helpers/expand-mime';
import { MicroConversion } from './MicroConversion';
import { MicroEmail } from './MicroEmail';
import { MicroHost } from './MicroHost';
import { MicroPurge } from './MicroPurge';

export class MicroConfig {
  @IsUrl({ require_tld: false, require_protocol: true, protocols: ['postgresql', 'postgres'] })
  databaseUrl: string;

  @IsString()
  @NotEquals('YOU_SHALL_NOT_PASS')
  secret: string;

  @IsEmail()
  inquiries: string;

  @IsNumber()
  @Transform(({ value }) => xbytes.parseSize(value))
  uploadLimit = xbytes.parseSize('50MB');

  @IsNumber()
  @IsOptional()
  @Max(500000)
  maxPasteLength = 500000;

  @IsMimeType({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const clean = expandMime(value);
    return new Set(clean);
  })
  allowTypes?: Set<string>;

  @IsString()
  @Transform(({ value }) => path.resolve(value))
  storagePath: string;

  @IsBoolean()
  restrictFilesToHost: boolean;

  @ValidateNested()
  @IsOptional()
  @Type(() => MicroPurge)
  purge?: MicroPurge;

  @ValidateNested()
  @IsOptional()
  @Type(() => MicroEmail)
  email: MicroEmail;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => MicroConversion)
  conversions?: MicroConversion[];

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => MicroHost)
  hosts: MicroHost[];

  get rootHost() {
    return this.hosts[0];
  }
}
