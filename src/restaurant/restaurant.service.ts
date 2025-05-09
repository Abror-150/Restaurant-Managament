import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantQueryDto } from './dto/create-restaurant.dto copy';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRestaurantDto) {
    try {
      let res = await this.prisma.restaurant.findFirst({
        where: { name: data.name },
      });
      if (res) {
        return { message: 'restaurant already exists' };
      }
      let region = await this.prisma.region.findFirst({
        where: { id: data.regionId },
      });
      if (!region) {
        return { message: 'region not found' };
      }

      return await this.prisma.restaurant.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create restaurant');
    }
  }

  async findAll(query: RestaurantQueryDto) {
    try {
      const { name, isActive, regionId } = query;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }

      if (isActive === 'true') {
        where.isActive = true;
      } else if (isActive === 'false') {
        where.isActive = false;
      }

      if (regionId) {
        where.regionId = Number(regionId);
      }

      const data = await this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
      });

      const total = await this.prisma.restaurant.count({ where });

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch restaurants');
    }
  }

  async findOne(id: number) {
    try {
      const restaurant = await this.prisma.restaurant.findFirst({
        where: { id },
        include: {
          categories: true,
          products: true,
          orders: true,
          users: true,
          Region: true,
        },
      });

      if (!restaurant) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }

      return restaurant;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch restaurant');
    }
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    try {
      const existing = await this.prisma.restaurant.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }

      return await this.prisma.restaurant.update({
        where: { id },
        data: updateRestaurantDto,
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to update restaurant');
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.restaurant.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }

      return await this.prisma.restaurant.delete({
        where: { id },
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to delete restaurant');
    }
  }
}
