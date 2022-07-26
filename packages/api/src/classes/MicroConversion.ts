import { Transform } from 'class-transformer';
import { IsMimeType, IsNumber, IsOptional, IsString } from 'class-validator';
import xbytes from 'xbytes';
import { expandMime } from '../helpers/expand-mime';

export class MicroConversion {
  @IsString({ each: true })
  @Transform(({ value }) => {
    const clean = expandMime(value);
    return new Set(clean);
  })
  from: Set<string>;

  @IsMimeType()
  to: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => xbytes.parseSize(value))
  minSize?: number;
}
