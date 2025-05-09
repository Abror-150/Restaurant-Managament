import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/region.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DebtModule } from './debt/debt.module';
import { WithdrawModule } from './withdraw/withdraw.module';

@Module({
  imports: [
    PrismaModule,
    RegionModule,
    RestaurantModule,
    CategoryModule,
    UserModule,
    ProductModule,
    OrderModule,
    DebtModule,
    WithdrawModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
