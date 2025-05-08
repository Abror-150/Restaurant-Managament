// order-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  productId: number;

  @IsNumber()
  @ApiProperty({ example: 2 })
  quantity: number;
}
