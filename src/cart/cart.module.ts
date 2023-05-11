import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { Cart } from 'src/database/entities/cart.entity';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';


@Module({
  imports: [ TypeOrmModule.forFeature([Cart, CartItem]), OrderModule ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
