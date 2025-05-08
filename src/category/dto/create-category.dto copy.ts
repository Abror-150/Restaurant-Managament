import {
  IsOptional,
  IsString,
  IsBooleanString,
  IsInt,
  Min,
} from 'class-validator';

export class GetCategoryQueryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  isActive?: string;

  @IsOptional()
  restaurantId?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
