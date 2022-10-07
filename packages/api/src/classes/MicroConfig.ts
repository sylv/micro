import bytes from 'bytes';
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
import { expandMime } from '../helpers/expand-mime.js';
import { MicroConversion } from './MicroConversion.js';
import { MicroEmail } from './MicroEmail.js';
import { MicroHost } from './MicroHost.js';
import { MicroPurge } from './MicroPurge.js';

export class MicroConfig {
  @IsUrl({ require_tld: false, require_protocol: true, protocols: ['postgresql', 'postgres'] })
  databaseUrl: string;

  @IsString()
  @NotEquals('YOU_SHALL_NOT_PASS')
  secret: string;

  @IsEmail()
  inquiries: string;

  @IsNumber()
  @Transform(({ value }) => bytes.parse(value))
  uploadLimit = bytes.parse('50MB');

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
    return this.hosts[0]!;
  }
}
