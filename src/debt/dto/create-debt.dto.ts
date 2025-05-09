import { ApiProperty } from "@nestjs/swagger"
import { DebtStatus } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateDebtDto {
    @ApiProperty({example: 1})
    @IsNumber()
    @IsNotEmpty()
    orderId: number

    @ApiProperty({example: 10})
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @ApiProperty({example: "Client"})
    @IsString()
    @IsNotEmpty()
    client: string

    @ApiProperty({example: "PENDING"})
    @IsEnum(DebtStatus)
    @IsNotEmpty()
    status: DebtStatus

    @ApiProperty({example: 1})
    @IsNumber()
    @IsNotEmpty()
    restaurantId: number
}
