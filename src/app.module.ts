import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
<<<<<<< HEAD
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [PrismaModule, RestaurantModule],
=======
import { RegionModule } from './region/region.module';

@Module({
  imports: [PrismaModule, RegionModule],
>>>>>>> a40aee940557558693fb67046dce0aa3c16f418c
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
