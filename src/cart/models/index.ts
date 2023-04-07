import { CartStatus } from "src/database/entities/cart.entity";

export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};

export type CartItem = {
  product: Product,
  count: number,
}

export type Cart = {
  id: string,
  items: CartItem[],
  status?: CartStatus,
  createdAt?: string,
  updatedAt?: string,
}
