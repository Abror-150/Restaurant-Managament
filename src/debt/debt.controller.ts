import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiQuery } from '@nestjs/swagger';
import { DebtStatus } from '@prisma/client';
import { filterDebtDto } from './dto/filter.dto';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtService.create(createDebtDto);
  }

  @Get()
  @ApiQuery({ name: 'orderId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: DebtStatus })
  @ApiQuery({ name: 'client', required: false,  type: String})
  @ApiQuery({ name: 'restaurantId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(@Query() query: filterDebtDto) {
    return this.debtService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(+id, updateDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(+id);
  }
}
