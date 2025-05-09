import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { filterDebtDto } from './dto/filter.dto';

@Injectable()
export class DebtService {

  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateDebtDto) {
    try {
      const existRestaurant = await this.prisma.restaurant.findFirst({where: {id: data.restaurantId}})
      if(!existRestaurant){
        return {message: "Please write restaurant that exists"}
      }

      const existOrder = await this.prisma.order.findFirst({where: {id: data.orderId}})
      if(!existOrder){
        return {message: "Please write order that exists"}
      }

      const one = await this.prisma.debt.create({data})
      return one
    } catch (error) {
      throw new BadRequestException("Error debt create")
    }
  }

  async findAll(query: filterDebtDto) {
    try {
      const { orderId, restaurantId, status, client,  page = 1, limit = 10 } = query;
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const where: any = {};
      if (orderId) where.orderId = orderId;
      if (restaurantId) where.restaurantId = Number(restaurantId);
      if (status) where.status = status;
      if (client) where.client = client;

      const [data, total] = await Promise.all([
        this.prisma.debt.findMany({
          where,
          skip: (pageNumber - 1) * limit,
          take: limitNumber,
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        data,
        total,
        pageNumber,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException("Error debt findall")
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.debt.findFirst({where: {id}})
      if(!one){
        return {message: "Debt not found"}
      }
      return one
    } catch (error) {
      throw new BadRequestException("Error debt findone")
    }
  }

  async update(id: number, data: UpdateDebtDto) {
    try {
      const one = await this.prisma.debt.update({where: {id}, data})
      return one
    } catch (error) {
      throw new BadRequestException("Error debt update")
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prisma.debt.delete({where: {id}})
      return one
    } catch (error) {
      throw new BadRequestException("Error debt delete")
    }
  }
}
