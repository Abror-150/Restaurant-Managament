import { ApiProperty } from "@nestjs/swagger"
import { WithdrawStatus } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator"

export class CreateWithdrawDto {
    @ApiProperty({example: 10})
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @ApiProperty({example: 1})
    @IsNumber()
    @IsNotEmpty()
    userId: number

    @ApiProperty({example: 1})
    @IsNumber()
    @IsNotEmpty()
    restaurantId: number

    @ApiProperty({example: "INCOME"})
    @IsEnum(WithdrawStatus)
    @IsNotEmpty()
    status: WithdrawStatus
}
