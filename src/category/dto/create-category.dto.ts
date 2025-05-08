import { ApiProperty } from '@nestjs/swagger';
import { BlobOptions } from 'buffer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Fast Food',
    description: 'Name of the category',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: true,
    description: 'Whether the category is active or not',
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: 1,
    description: 'ID of the restaurant this category belongs to',
  })
  @IsNumber()
  restaurantId: number;
}
