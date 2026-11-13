import type { Order } from "../domain/order.ts";

export type Page<T> = { items: T[]; total: number };

export interface OrderRepository {
  nextId(): string;
  findById(id: string): Promise<Order | undefined>;
  listByCustomer(customerId: string, page: { limit: number; offset: number }): Promise<Page<Order>>;
  save(order: Order): Promise<void>;
}
