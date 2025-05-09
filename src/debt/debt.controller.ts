import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiQuery } from '@nestjs/swagger';
import { DebtStatus, UserRole } from '@prisma/client';
import { filterDebtDto } from './dto/filter.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles } from 'src/user/decorators/rbuc.decorator';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Roles(UserRole.CASSER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtService.create(createDebtDto);
  }
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'orderId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: DebtStatus })
  @ApiQuery({ name: 'client', required: false, type: String })
  @ApiQuery({ name: 'restaurantId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(@Query() query: filterDebtDto) {
    return this.debtService.findAll(query);
  }
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(+id);
  }
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER, UserRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(+id, updateDebtDto);
  }
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(+id);
  }
}
