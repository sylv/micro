import { IsEmail, IsOptional } from 'class-validator';

export class ResendVerificationEmailDto {
  @IsEmail()
  @IsOptional()
  email?: string;
}
