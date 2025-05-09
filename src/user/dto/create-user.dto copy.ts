import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Alex' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '+998888888888' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ example: '1' })
  @IsNumber()
  @IsPositive()
  restaurantId: number;
}
