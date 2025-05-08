import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Pizza Place',
    description: 'Name of the restaurant',
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123 Main St, City',
    description: 'Full address of the restaurant',
  })
  address: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of the restaurant',
  })
  phone: string;
  @IsNumber()
  @ApiProperty({
    example: 10,
    description: 'Tip percentage or fixed amount for the restaurant',
  })
  tip: number;
  @IsBoolean()
  @ApiProperty({ example: true, description: 'Restaurant activity status' })
  isActive: boolean;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Region ID where the restaurant is located',
  })
  regionId: number;
}
