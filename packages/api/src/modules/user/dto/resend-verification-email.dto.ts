import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class ResendVerificationEmailDto {
  @IsEmail()
  @IsOptional()
  @Field()
  email?: string;
}
