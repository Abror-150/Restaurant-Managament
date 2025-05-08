import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProductQueryDto } from './dto/create-product.dto copy';
import * as ExcelJS from 'exceljs';

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
  async exportToExcel() {
    const products = await this.prisma.product.findMany({
      include: {
        Category: true,
        Restaurant: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Is Active', key: 'isActive', width: 12 },
      { header: 'Category', key: 'categoryName', width: 20 },
      { header: 'Restaurant', key: 'restaurantName', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    products.forEach((product) => {
      worksheet.addRow({
        id: product.id,
        name: product.name,
        price: product.price,
        isActive: product.isActive ? 'Yes' : 'No',
        categoryName: product.categoryId || 'No Category',
        restaurantName: product.restaurantId || 'No Restaurant',
      });
    });

    return await workbook.xlsx.writeBuffer();
  }

  async findAll(query: GetProductQueryDto) {
    const {
      name,
      categoryId,
      isActive,
      restaurantId,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };

    if (categoryId) where.categoryId = Number(categoryId);

    if (isActive === 'true') {
      where.isActive = true;
    } else if (isActive === 'false') {
      where.isActive = false;
    }

    if (restaurantId) where.restaurantId = Number(restaurantId);

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (pageNumber - 1) * limit,
      take: limitNumber,
    });

    const total = await this.prisma.product.count({ where });

    return {
      data: products,
      total,
      pageNumber,
      totalPages: Math.ceil(total / limit),
    };
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
