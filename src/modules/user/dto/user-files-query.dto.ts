import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UserFilesQueryDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => +value)
  take?: number;

  @IsString()
  @IsOptional()
  cursor?: string;
}
