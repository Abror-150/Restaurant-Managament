import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/region.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [PrismaModule, RegionModule, RestaurantModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
