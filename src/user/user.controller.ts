import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  RawBody,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-user.dto copy';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles } from './decorators/rbuc.decorator';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { log } from 'node:console';
import { ApiQuery } from '@nestjs/swagger';
import { CreateUserLoginDto } from './dto/create-userLogin.dto copy 2';
import { userInfo } from 'node:os';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('login')
  login(@Body() data: CreateUserLoginDto) {
    return this.userService.login(data);
  }
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Foydalanuvchi ismi bo‘yicha qidirish',
  })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
    description: 'Restoran ID bo‘yicha filter',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'id', 'balance'],
    description: 'Qaysi ustun bo‘yicha tartiblash',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Tartib (asc yoki desc)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Sahifa raqami (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Har bir sahifadagi elementlar soni (default: 10)',
    example: 10,
  })
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }
  @Get('top-earners')
  async getTopWaiters(
    @Query('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.userService.getTopWaiters(restaurantId);
  }
  @Get('waiter-stats')
  async getWaiterStats() {
    return await this.userService.waiterOrderStats();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post('add/admin')
  createAdmin(@Body() data: CreateAdminDto) {
    return this.userService.createAdmin(data);
  }
}
