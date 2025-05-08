import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './create-order.dto copy';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @ApiProperty({ example: '2 stol' })
  table?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  restaurantId?: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of order items',
  })
  orderItems?: OrderItemDto[];
}
