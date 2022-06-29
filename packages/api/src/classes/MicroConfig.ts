import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import fileType from 'file-type';
import path from 'path';
import xbytes from 'xbytes';
import { MicroConfigPurge } from './MicroConfigPurge';
import { MicroEmail } from './MicroEmail';
import { MicroHost } from './MicroHost';

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

  @IsBoolean()
  publicPastes: boolean;

  @IsNumber()
  @IsOptional()
  @Max(500000)
  maxPasteLength = 500000;

  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const clean: string[] = [];
    for (const type of value) {
      const stripped = type.replace(/\/\*$/u, '');
      if (stripped.includes('/')) {
        if (!fileType.mimeTypes.has(type)) {
          throw new Error(`Invalid mime type: ${type}`);
        }

        clean.push(type);
        continue;
      }

      for (const knownType of fileType.mimeTypes.values()) {
        if (knownType.startsWith(stripped)) clean.push(knownType);
      }
    }

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
  @Type(() => MicroConfigPurge)
  purge?: MicroConfigPurge;

  @ValidateNested()
  @IsOptional()
  @Type(() => MicroEmail)
  email: MicroEmail;

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => MicroHost)
  hosts: MicroHost[];

  get rootHost() {
    return this.hosts[0];
  }
}
