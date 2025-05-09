import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { ApiQuery } from '@nestjs/swagger';
import { WithdrawStatus } from '@prisma/client';
import { filterWithdrawDto } from './dto/filter.dto';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.withdrawService.create(createWithdrawDto);
  }

  @Get()
  @ApiQuery({ name: 'amount', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: WithdrawStatus })
  @ApiQuery({ name: 'restaurantId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(@Query() query: filterWithdrawDto) {
    return this.withdrawService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWithdrawDto: UpdateWithdrawDto) {
    return this.withdrawService.update(+id, updateWithdrawDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawService.remove(+id);
  }
}
