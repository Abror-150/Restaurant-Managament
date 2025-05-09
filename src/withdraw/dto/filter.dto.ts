import { DebtStatus, WithdrawStatus } from "@prisma/client"
import { IsOptional } from "class-validator"

export class filterWithdrawDto {
    @IsOptional()
    amount?: number

  
    @IsOptional()
    status?:  WithdrawStatus
  
    @IsOptional()
    restaurantId?:  number

    @IsOptional()
    page?: number;
  
    @IsOptional()
    limit?: number;
}