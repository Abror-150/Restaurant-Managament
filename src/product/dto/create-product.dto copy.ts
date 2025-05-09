import { IsOptional } from 'class-validator';

export class GetProductQueryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  isActive?: string;

  @IsOptional()
  restaurantId?: number;
  @IsOptional()
  categoryId?: number;
  @IsOptional()
  sortBy?: 'name' | 'price' | 'categoryId';
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
