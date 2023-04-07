import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Repository } from 'typeorm';

import { v4 } from 'uuid';

import { Cart } from '../models';
import { CartItem as CartItemEntity } from 'src/database/entities/cart-item.entity';
import { Cart as CartEntity, CartStatus } from 'src/database/entities/cart.entity';

/**
 * Returns some representation of Cart entity.
 * Should be fine for this task, but, ideally, models should be updated.
 * @param entity 
 * @returns 
 */
function cartEntityToCart(entity: CartEntity): Cart {
  return {
    id: entity.id,
    items: entity.cartItems.map((cartItem, i) => ({
      count: cartItem.count,
      // Dummy product, as there is no product data in the DB
      product: {
        id: cartItem.productId,
        title: `Product ${cartItem.productId}`,
        description: `Product ${cartItem.productId}`,
        price: 10 * (i + 1)
      }
    })),
    status: entity.status,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt
  };
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartsRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemsRepository: Repository<CartItemEntity>,
  ) {}  

  async findByUserId(userId: string): Promise<Cart> {
    const entity = await this.cartsRepository.findOne({ 
      where: { userId }, 
      relations: { cartItems: true } 
    });

    console.log(entity);

    if (entity) {
      return cartEntityToCart(entity);
    }

    return null;
  }

  async createByUserId(userId: string) {
    const id = v4(v4());
    const newCart = this.cartsRepository.create({
      id,
      userId,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      updatedAt: format(new Date(), 'yyyy-MM-dd'),
      status: CartStatus.OPEN
    });
    await this.cartsRepository.save(newCart);
    
    return {
      id,
      items: []
    };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const itemEntities = items.map(itemData => this.cartItemsRepository.create({
      cartId: id,
      productId: itemData.product.id,
      count: itemData.count
    }));

    await this.cartItemsRepository.save(itemEntities);

    const updatedCart = await this.cartsRepository.findOne({ 
      where: { id }, 
      relations: { cartItems: true } 
    });

    console.log(updatedCart);

    return cartEntityToCart(updatedCart);
  }

  async updateStatusById(cartId: string, status: CartStatus): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({ 
      where: { id: cartId },
      relations: { cartItems: true } 
    });

    if (!cart) {
      throw new Error('Cart does not exist.');
    }

    await this.cartsRepository.update({ id: cartId }, { status });

    cart.status = status;

    return cartEntityToCart(cart);
  }

  async removeByUserId(userId): Promise<void> {
    await this.cartsRepository.delete({ userId });
  }

}
