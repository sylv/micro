import { IsEmail, IsObject } from 'class-validator';

export class MicroEmail {
  @IsEmail()
  from: string;

  @IsObject()
  smtp: Record<string, any>;
}
