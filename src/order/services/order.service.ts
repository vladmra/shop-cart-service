import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../models';
import { Order as OrderEntity, OrderStatus } from 'src/database/entities/order.entity';
import { Cart as CartEntity } from 'src/database/entities/cart.entity';

/**
 * Returns some representation of Order entity.
 * Should be fine for this task, but, ideally, models should be updated.
 * @param entity 
 * @returns 
 */
function orderEntityToOrder(entity: OrderEntity): Order {
  return {
    id: entity.id,
    userId: entity.userId,
    cartId: entity.cartId,
    items: entity.cart.cartItems.map((cartItem, i) => ({
      count: cartItem.count,
      // Dummy product, as there is no product data in the DB
      product: {
        id: cartItem.productId,
        title: `Product ${cartItem.productId}`,
        description: `Product ${cartItem.productId}`,
        price: 10 * (i + 1)
      }
    })),
    payment: entity.payment as unknown as {
      type: string,
      address?: any,
      creditCard?: any,
    },
    delivery: entity.delivery as unknown as {
      type: string,
      address: any,
    },
    comments: entity.comments,
    status: entity.status,
    total: entity.total
  };
}

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {}

  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(CartEntity)
    private cartsRepository: Repository<CartEntity>
  ) {}  

  async findById(orderId: string): Promise<Order> {
    const entity = await this.ordersRepository.findOne({ 
      where: { id: orderId }, 
      relations: { cart: true }
    });

    return orderEntityToOrder(entity);
  }

  async create(data: any): Promise<Order> {
    const id = v4(v4());
    const {cartId, userId, total, payment, delivery, comments} = data;
    const newOrder = this.ordersRepository.create({
      id,
      cartId,
      userId,
      total,
      payment,
      delivery,
      comments,
      status: OrderStatus.OPEN
    });

    await this.ordersRepository.save(newOrder);

    // Loading related cart data separately, 
    // but maybe there is a way to do it with order creation?
    const cart = await this.cartsRepository.findOne({ 
      where: { id: cartId }, 
      relations: { cartItems: true } 
    });
    newOrder.cart = cart;

    return orderEntityToOrder(newOrder);
  }

  async update(orderId, data) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    return await this.ordersRepository.update({ id: orderId }, { ...data });
  }
}
