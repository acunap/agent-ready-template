import type { Order } from "../../domain/order.ts";
import type { OrderRepository, Page } from "../../ports/order-repository.ts";
import type { ListCustomerOrdersRequest } from "./list-customer-orders.request.ts";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export type CustomerOrderSummary = {
  id: string;
  status: Order["status"];
  totalItems: number;
  placedAt: string;
};

export type ListCustomerOrders = (req: ListCustomerOrdersRequest) => Promise<Page<CustomerOrderSummary>>;

const toSummary = (order: Order): CustomerOrderSummary => ({
  id: order.id,
  status: order.status,
  totalItems: order.lines.reduce((total, line) => total + line.quantity, 0),
  placedAt: order.placedAt.toISOString(),
});

export function makeListCustomerOrders(orders: OrderRepository): ListCustomerOrders {
  return async (req) => {
    const limit = Math.min(Math.max(req.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    const offset = Math.max(req.offset ?? 0, 0);
    const page = await orders.listByCustomer(req.customerId, { limit, offset });
    return { items: page.items.map(toSummary), total: page.total };
  };
}
