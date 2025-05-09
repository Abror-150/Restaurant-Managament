import { DebtStatus } from "@prisma/client"
import { IsOptional } from "class-validator"

export class filterDebtDto {

    @IsOptional()
    orderId?: number

    @IsOptional()
    amount?: number


    @IsOptional()
    client?: string


    @IsOptional()
    status?: DebtStatus


    @IsOptional()
    restaurantId?: number

    @IsOptional()
    page?: number;
  
    @IsOptional()
    limit?: number;
}