import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { filterWithdrawDto } from './dto/filter.dto';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWithdrawDto) {
    try {
      const existUser = await this.prisma.user.findFirst({
        where: { id: data.userId },
      });
      if (!existUser) {
        return { message: 'Please write user that exists' };
      }

      const existRestaurant = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!existRestaurant) {
        return { message: 'Please write restaurant that exists' };
      }

      const one = await this.prisma.withdraw.create({ data });

      if (data.status === 'INCOME') {
        await this.prisma.restaurant.update({
          where: { id: data.restaurantId },
          data: {
            income: {
              increment: Number(data.amount),
            },
          },
        });
      } else if (data.status === 'OUTCOME') {
        await this.prisma.restaurant.update({
          where: { id: data.restaurantId },
          data: {
            outcome: {
              increment: Number(data.amount),
            },
          },
        });
      }
      return one;
    } catch (error) {
      throw new BadRequestException('withdraw create error');
    }
  }

  async findAll(query: filterWithdrawDto) {
    try {
      const {
        userId,
        restaurantId,
        status,
        amount,
        page = 1,
        limit = 10,
      } = query;
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const where: any = {};

      if (userId) where.userId = userId;
      if (restaurantId) where.restaurantId = Number(restaurantId);
      if (status) where.status = status;
      if (amount) where.amount = amount;

      const [data, total] = await Promise.all([
        this.prisma.withdraw.findMany({
          where,
          skip: (pageNumber - 1) * limit,
          take: limitNumber,
        }),
        this.prisma.withdraw.count({ where }),
      ]);

      return {
        data,
        total,
        pageNumber,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('withdraw findall error');
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.withdraw.findFirst({ where: { id } });
      if (!one) {
        return { message: 'withdraw not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException('withdraw findone error');
    }
  }

  async update(id: number, data: UpdateWithdrawDto) {
    try {
      const one = await this.prisma.withdraw.update({ where: { id }, data });
      return one;
    } catch (error) {
      throw new BadRequestException('withdraw update error');
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prisma.withdraw.delete({ where: { id } });
      return one;
    } catch (error) {
      throw new BadRequestException('withdraw delete error');
    }
  }
}
