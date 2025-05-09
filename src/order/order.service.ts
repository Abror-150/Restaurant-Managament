import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { filterOrderDto } from './dto/create-orderItems.dto copy 2';
import * as ExcelJS from 'exceljs';
@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateOrderDto, userId: number) {
    try {
      const productIds = data.orderItems.map((item) => item.productId);

      const products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
        select: {
          id: true,
          price: true,
        },
      });

      for (const item of data.orderItems) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          return { message: 'product not found' };
        }
      }

      const total = data.orderItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return sum + item.quantity * product.price;
      }, 0);

      const restar = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
        select: { tip: true },
      });
      if (!restar) {
        return { message: 'restaurant not found' };
      }
      const waiterBalance = total * (restar.tip / 100);

      const created = await this.prisma.order.create({
        data: {
          table: data.table,
          restaurantId: data.restaurantId,
          userId: Number(userId),
          total,
          status: data.status,
          orderItems: {
            create: data.orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: { orderItems: true },
      });
      const updatedWaiter = await this.prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          balance: {
            increment: waiterBalance,
          },
        },
      });

      return created;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Order yaratishda xatolik yuz berdi',
      );
    }
  }
  async exportToExcel() {
    const orders = await this.prisma.order.findMany({
      include: {
        User: true,
        orderItems: {
          include: { Product: true },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'Order ID', key: 'id', width: 10 },
      { header: 'Restaurant id', key: 'restaurantId', width: 25 },
      { header: 'User id', key: 'userId', width: 15 },
    ];

    orders.forEach((order) => {
      worksheet.addRow({
        id: order.id,
        userId: order.userId,
        restaurantId: order.restaurantId,
      });
    });

    return await workbook.xlsx.writeBuffer();
  }

  async findAll(query: filterOrderDto) {
    const { table, restaurantId, status, page = 1, limit = 10 } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const where: any = {};
    if (table) where.table = table;
    if (restaurantId) where.restaurantId = Number(restaurantId);
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
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
  }
  async waiterOrderStats() {
    try {
      const stats = await this.prisma.order.groupBy({
        by: ['userId'],
        _count: {
          id: true,
        },
        _avg: {
          total: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      const result = await Promise.all(
        stats.map(async (item) => {
          const waiter = await this.prisma.user.findUnique({
            where: { id: item.userId },
            select: { id: true, name: true, phone: true },
          });

          return {
            waiter,
            totalOrders: item._count.id,
            averageOrderPrice: item._avg.total,
          };
        }),
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Waiter order stats error');
    }
  }

  async findOne(id: number) {
    try {
      let data = await this.prisma.order.findFirst({ where: { id } });
      if (!data) {
        return { message: 'order not found' };
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException('internal server error');
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const { orderItems, ...rest } = updateOrderDto;

      let data: any = { ...rest };

      if (orderItems) {
        data.orderItems = {
          deleteMany: { orderId: id },
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            orderId: id,
          })),
        };
      }

      const updated = await this.prisma.order.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async remove(id: number) {
    try {
      let data = await this.prisma.order.delete({ where: { id } });
      if (!data) {
        return { message: 'order not found' };
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException('internal server error');
    }
  }
}
