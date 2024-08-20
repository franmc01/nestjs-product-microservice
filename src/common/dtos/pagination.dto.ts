import { IsPositive, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
