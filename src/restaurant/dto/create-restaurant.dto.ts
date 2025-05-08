import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Pizza Place',
    description: 'Name of the restaurant',
  })
  name: string;

  @ApiProperty({
    example: '123 Main St, City',
    description: 'Full address of the restaurant',
  })
  address: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of the restaurant',
  })
  phone: string;

  @ApiProperty({
    example: 10,
    description: 'Tip percentage or fixed amount for the restaurant',
  })
  tip: number;

  @ApiProperty({ example: true, description: 'Restaurant activity status' })
  isActive: boolean;

  @ApiProperty({
    example: 1,
    description: 'Region ID where the restaurant is located',
  })
  regionId: number;
}
