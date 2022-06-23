import { IsLowercase, IsNotIn, IsString, MaxLength, MinLength } from 'class-validator';
import blocklist from '../../../blocklist.json';

export class CreateUserDto {
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsLowercase()
  @IsNotIn(blocklist, { message: ({ value }) => `Restricted username "${value}"` })
  username: string;

  @MaxLength(100)
  @MinLength(5)
  @IsString()
  password: string;

  @IsString()
  invite: string;
}
