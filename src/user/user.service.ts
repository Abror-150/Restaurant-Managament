import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { log } from 'console';
import { CreateUserLoginDto } from './dto/create-userLogin.dto copy 2';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const allowedRoles: UserRole[] = ['WAITER', 'OWNER', 'CASSER'];
      if (!allowedRoles.includes(data.role)) {
        return {
          message:
            " 'Faqat WAITER, OWNER yoki CASHIER rolida  yaratish mumkin'",
        };
      }

      const existRestaurant = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!existRestaurant) {
        return { message: 'Please write restaurant that exists' };
      }
      let hash = bcrypt.hashSync(data.password, 10);
      const created = await this.prisma.user.create({
        data: {
          name: data.name,
          phone: data.phone,
          password: hash,
          role: data.role,
          restaurantId: data.restaurantId,
        },
      });
      return created;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('User create error');
    }
  }
  async login(data: CreateUserLoginDto) {
    try {
      let user = await this.prisma.user.findFirst({
        where: { phone: data.phone },
      });
      if (!user) {
        return { message: 'user not found' };
      }

      let match = bcrypt.compareSync(data.password, user.password);
      console.log(match);

      if (!match) {
        return { message: 'password incorrect' };
      }

      const token = this.jwt.sign({ id: user.id, role: user.role });

      return { token };
    } catch (error) {
      throw new InternalServerErrorException('internal server error');
    }
  }

  async findAll(query: {
    name?: string;
    restaurantId?: number;
    sortBy?: 'name' | 'id' | 'balance';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        name,
        restaurantId,
        sortBy = 'id',
        sortOrder = 'asc',
        page = 1,
        limit = 10,
      } = query;
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;

      const where: any = {};
      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }
      if (restaurantId) {
        where.restaurantId = Number(restaurantId);
      }

      const data = await this.prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });

      const total = await this.prisma.user.count({ where });

      return {
        data,
        total,
        pageNumber,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('User findAll error');
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.user.findFirst({ where: { id } });
      if (!one) {
        return { message: "Couldn't find region" };
      }
      return one;
    } catch (error) {
      throw new BadRequestException('User findone error');
    }
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      const existRestaurant = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!existRestaurant) {
        return { message: 'Please write restaurant that exists' };
      }
      const one = await this.prisma.user.update({ where: { id }, data });
      return one;
    } catch (error) {
      throw new BadRequestException('User update error');
    }
  }

  async remove(id: number) {
    try {
      const existsUser = await this.prisma.user.findFirst({ where: { id } });
      if (!existsUser) {
        return { message: 'user not found' };
      }
      const one = await this.prisma.user.delete({ where: { id } });
      return one;
    } catch (error) {
      throw new BadRequestException('User remove error');
    }
  }
  async createAdmin(data: CreateUserDto) {
    try {
      if (!['ADMIN', 'SUPER_ADMIN'].includes(data.role)) {
        return {
          message: 'Faqat admin yoki super_admin roliga ruxsat berilgan',
        };
      }
      const existing = await this.prisma.user.findFirst({
        where: { phone: data.phone },
      });
      if (existing) {
        return { message: 'Telefon raqami allaqachon mavjud' };
      }

      const existsRes = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!existsRes) {
        return { message: 'restaurant not found' };
      }

      const hash = await bcrypt.hash(data.password, 10);
      const created = await this.prisma.user.create({
        data: {
          name: data.name,
          phone: data.phone,
          password: hash,
          role: data.role,
          restaurantId: data.restaurantId,
        },
      });

      return created;
    } catch (error) {
      throw new InternalServerErrorException(
        'Admin yaratishda xatolik yuz berdi',
      );
    }
  }
}
