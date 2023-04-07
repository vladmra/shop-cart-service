import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity('cart_items')
export class CartItem {
  @PrimaryColumn({ name: 'cart_id', type: 'uuid', nullable: false, unique: false })
  cartId: string;

  @PrimaryColumn({ type: 'uuid', nullable: false, unique: false })
  productId: string;

  @Column({ type: 'integer' })
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
