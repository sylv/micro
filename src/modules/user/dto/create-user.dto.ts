import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  username!: string;

  @MaxLength(100)
  @MinLength(5)
  @IsString()
  password!: string;

  @IsString()
  invite!: string;
}
