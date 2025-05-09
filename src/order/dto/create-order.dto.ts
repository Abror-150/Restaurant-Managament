import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { OrderItemDto } from './create-order.dto copy';

export class CreateOrderDto {
  @IsString()
  @ApiProperty({ example: '2 stol' })
  table: string;
  @IsNumber()
  @IsPositive()
  @ApiProperty({ example: 1 })
  restaurantId: number;
  @ApiProperty({ example: 'PENDING' })
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of order items',
  })
  orderItems: OrderItemDto[];
}
