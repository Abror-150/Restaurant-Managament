import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { GetProductQueryDto } from './dto/create-product.dto copy';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { UserRole } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.CASSER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get('top-products/:restaurantId')
  async getTopProducts(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.productService.getTopProductsByRestaurant(restaurantId);
  }

  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.SUPER_ADMIN, UserRole.CASSER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get('export')
  @ApiOperation({ summary: 'Export products to Excel' })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async exportProducts(@Res() res: Response) {
    const buffer = await this.productService.exportToExcel();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
    res.send(buffer);
  }
  @Get()
  @ApiQuery({
    name: 'name',
    description: 'Filter products by name (case-insensitive)',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'categoryId',
    description: 'Filter products by category ID',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'isActive',
    description: 'Filter by product status (true or false)',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'restaurantId',
    description: 'Filter by restaurant ID',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort products by field (name, price, categoryId)',
    required: false,
    type: String,
    enum: ['name', 'price', 'categoryId'],
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort products in ascending or descending order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    type: Number,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page for pagination',
    required: false,
    type: Number,
    default: 10,
  })
  findAll(
    @Query()
    query: GetProductQueryDto,
  ) {
    return this.productService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
