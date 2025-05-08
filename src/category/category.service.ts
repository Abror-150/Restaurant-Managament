import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.category.findUnique({
        where: { id },
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
