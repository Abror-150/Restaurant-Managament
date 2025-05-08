import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Coca-Cola', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'Category ID (foreign key)' })
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ example: true, description: 'Whether the product is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 5000, description: 'Product price in UZS' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 2, description: 'Restaurant ID (foreign key)' })
  @IsNumber()
  @IsPositive()
  restaurantId: number;
}
