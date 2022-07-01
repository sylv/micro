import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ResendVerificationEmailDto {
  @IsEmail()
  @Field()
  email: string;
}
