import { Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class Pagination {
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset = 0;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit = 50;
}
