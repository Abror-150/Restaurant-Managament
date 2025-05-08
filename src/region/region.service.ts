import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {

  constructor(private readonly prisma: PrismaService){}

  async regionFinder(name: string){
    const one = await this.prisma.region.findFirst({where: {name}})
    return one
  }

  async create(data: CreateRegionDto) {
    try {
      if(!data.name){
        return {message: "Please write region name"}
      }
      
      const existRegion = await this.regionFinder(data.name)
      if(existRegion){
        return {message: "This Region exists"}
      }

      const one = await this.prisma.region.create({data})
      return one
    } catch (error) {
      throw new BadRequestException("Region create error")
    }
  }

  async findAll() {
    try {
      const one = await this.prisma.region.findMany()
      return one;
    } catch (error) {
      throw new BadRequestException("Region findall error")
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.region.findFirst({where: {id}})
      return one;
    } catch (error) {
      throw new BadRequestException("Region findone error")
    }
  }

  async update(id: number, data: UpdateRegionDto) {
    try {
      if(!data.name){
        return {message: "Please write region name"}
      }
      const one = await this.prisma.region.update({where: {id}, data})
      return one;
    } catch (error) {
      throw new BadRequestException("Region update error")
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prisma.region.delete({where: {id}})
      return one;
    } catch (error) {
      throw new BadRequestException("Region delete error")
    }
  }
}
