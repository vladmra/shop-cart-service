import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { Order } from "./order.entity";

export enum CartStatus {
    OPEN = 'OPEN',
    ORDERED = 'ORDERED'
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'date', nullable: false })
  createdAt: string;

  @Column({ type: 'date', nullable: false })
  updatedAt: string;

  @Column({ type: 'enum', enum: CartStatus })
  status: CartStatus;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  @JoinColumn({ name: 'id' })
  cartItems: CartItem[];

  @OneToOne(() => Order, (order) => order.cart)
  @JoinColumn({ name: 'id' })
  order: Order;
}
