import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegionQueryDto } from './dto/create-region.dto copy';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async regionFinder(name: string) {
    const one = await this.prisma.region.findFirst({ where: { name } });
    return one;
  }

  async create(data: CreateRegionDto) {
    try {
      if (!data.name) {
        return { message: 'Please write region name' };
      }

      const existRegion = await this.regionFinder(data.name);
      if (existRegion) {
        return { message: 'This Region exists' };
      }

      const one = await this.prisma.region.create({ data });
      return one;
    } catch (error) {
      throw new BadRequestException('Region create error');
    }
  }

  async findAll(query: RegionQueryDto) {
    try {
      const { name, page = 1, limit = 10, sort = 'asc' } = query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (name) {
        where.name = {
          contains: name,
          mode: 'insensitive',
        };
      }

      const orderBy: any = {};
      if (sort && sort.toLowerCase() === 'desc') {
        orderBy.name = 'desc';
      } else {
        orderBy.name = 'asc';
      }

      const data = await this.prisma.region.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
      });

      const total = await this.prisma.region.count({ where });

      return {
        data,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      };
    } catch (error) {
      throw new BadRequestException('Region findAll error');
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.region.findFirst({ where: { id } });
      return one;
    } catch (error) {
      throw new BadRequestException('Region findone error');
    }
  }

  async update(id: number, data: UpdateRegionDto) {
    try {
      if (!data.name) {
        return { message: 'Please write region name' };
      }
      const one = await this.prisma.region.update({ where: { id }, data });
      return one;
    } catch (error) {
      throw new BadRequestException('Region update error');
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prisma.region.delete({ where: { id } });
      return one;
    } catch (error) {
      throw new BadRequestException('Region delete error');
    }
  }
}
