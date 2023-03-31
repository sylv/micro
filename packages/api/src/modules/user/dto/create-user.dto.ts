import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsLowercase, IsNotIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import blocklist from '../../../blocklist.json' assert { type: 'json' };

@InputType()
export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsLowercase()
  @IsNotIn(blocklist, { message: ({ value }) => `restricted username "${value}"` })
  @Field()
  username: string;

  @MaxLength(100)
  @MinLength(5)
  @IsString()
  @Field()
  password: string;

  @IsString()
  @Field()
  invite: string;
}
