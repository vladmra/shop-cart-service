import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { Order } from 'src/database/entities/order.entity';
import { OrderService } from './services';

@Module({
  imports: [ TypeOrmModule.forFeature([Order, Cart]) ],
  providers: [ OrderService ],
  exports: [ OrderService ]
})
export class OrderModule {}
