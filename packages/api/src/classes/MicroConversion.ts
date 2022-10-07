import bytes from 'bytes';
import { Transform } from 'class-transformer';
import { IsMimeType, IsNumber, IsOptional, IsString } from 'class-validator';
import { expandMime } from '../helpers/expand-mime.js';

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
  @Transform(({ value }) => bytes.parse(value))
  minSize?: number;
}
