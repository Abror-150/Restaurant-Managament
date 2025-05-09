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
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserRole, WithdrawStatus } from '@prisma/client';
import { filterWithdrawDto } from './dto/filter.dto';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.withdrawService.create(createWithdrawDto);
  }
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
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
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawService.findOne(+id);
  }
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER, UserRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWithdrawDto: UpdateWithdrawDto,
  ) {
    return this.withdrawService.update(+id, updateWithdrawDto);
  }
  @Roles(UserRole.CASSER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawService.remove(+id);
  }
}
