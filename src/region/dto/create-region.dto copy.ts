import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegionQueryDto {
  @ApiPropertyOptional({ description: 'Filter by region name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Sort by name (asc or desc)',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: string;
}
