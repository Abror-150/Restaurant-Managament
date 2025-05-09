import { OrderStatus } from '@prisma/client';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';

export class filterOrderDto {
  @IsOptional()
  table?: string;

  @IsOptional()
  restaurantId?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
