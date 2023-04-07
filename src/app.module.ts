import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CartModule,
    OrderModule,
    DatabaseModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
