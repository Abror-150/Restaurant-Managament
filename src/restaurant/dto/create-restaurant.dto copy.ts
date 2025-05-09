import {
  IsOptional,
  IsString,
  IsBooleanString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RestaurantQueryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  isActive?: string;

  @IsOptional()
  regionId?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
