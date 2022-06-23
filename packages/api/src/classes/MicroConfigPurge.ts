import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import ms from 'ms';
import xbytes from 'xbytes';

export class MicroConfigPurge {
  @IsNumber()
  @Transform(({ value }) => xbytes.parseSize(value))
  overLimit: number;

  @IsNumber()
  @Transform(({ value }) => ms(value))
  afterTime: number;
}
