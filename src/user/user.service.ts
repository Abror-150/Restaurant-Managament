import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const existRestaurant = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!existRestaurant) {
        return { message: 'Please write restaurant that exists' };
      }

      const one = await this.prisma.user.create({ data });

      const token = this.jwt.sign({ id: one.id, role: one.role });

      return { token };
    } catch (error) {
      throw new BadRequestException('User create error');
    }
  }

  async findAll() {
    try {
      const one = await this.prisma.user.findMany();
      return one;
    } catch (error) {
      throw new BadRequestException('User findall error');
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
      const one = await this.prisma.user.delete({ where: { id } });
      return one;
    } catch (error) {
      throw new BadRequestException('User remove error');
    }
  }
}
