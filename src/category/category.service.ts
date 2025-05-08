import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCategoryQueryDto } from './dto/create-category.dto copy';
import { NUMBER } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    try {
      let restaurantID = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!restaurantID) {
        return { message: 'restaurantId not found' };
      }
      return await this.prisma.category.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll(query: GetCategoryQueryDto) {
    try {
      const { name, isActive, restaurantId } = query;
      const page = Number(query.page) || 1;
      const limit = query.limit || 10;
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

      if (restaurantId !== undefined) {
        where.restaurantId = Number(restaurantId);
      }

      const data = await this.prisma.category.findMany({
        where,
        skip,
        take: Number(limit),
      });

      const total = await this.prisma.category.count({ where });

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.category.findFirst({
        where: { id },
        include: { products: true },
      });
      if (!one) {
        return { message: 'category not found' };
      }
      return one;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const existing = await this.prisma.category.findUnique({ where: { id } });
      if (!existing) {
        return { message: 'category not found' };
      }

      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.category.findUnique({ where: { id } });
      if (!existing) {
        return { message: 'category not found' };
      }

      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
