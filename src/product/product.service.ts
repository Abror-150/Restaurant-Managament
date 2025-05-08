import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    try {
      const resturantId = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!resturantId) {
        return { message: 'restaurantId not found' };
      }
      const categoryId = await this.prisma.category.findFirst({
        where: { id: data.categoryId },
      });
      if (!categoryId) {
        return { message: 'categoryId not found' };
      }
      return await this.prisma.product.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll() {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get products');
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) return { message: 'product not found' };
      return product;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const existing = await this.prisma.product.findUnique({ where: { id } });
      if (!existing) return { message: 'product not found' };

      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.product.findUnique({ where: { id } });
      if (!existing) return { message: 'product not found' };

      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
