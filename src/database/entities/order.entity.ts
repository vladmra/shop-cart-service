import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { Cart } from "./cart.entity";

export enum OrderStatus {
    OPEN = 'OPEN',
    ORDERED = 'ORDERED'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'cart_id', type: 'uuid', nullable: false, unique: false })
  cartId: string;

  @Column({ type: 'json' })
  payment: JSON;

  @Column({ type: 'json' })
  delivery: JSON;

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'numeric', nullable: false })
  total: number;

  @OneToOne(() => Cart, (cart) => cart.order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
