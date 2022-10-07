import bytes from 'bytes';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import ms from 'ms';

export class MicroPurge {
  @IsNumber()
  @Transform(({ value }) => bytes.parse(value))
  overLimit: number;

  @IsNumber()
  @Transform(({ value }) => ms(value))
  afterTime: number;
}
