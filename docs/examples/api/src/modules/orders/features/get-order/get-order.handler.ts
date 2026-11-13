import type { Order } from "../../domain/order.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";
import type { GetOrderRequest } from "./get-order.request.ts";

export type OrderDetails = {
  id: string;
  customerId: string;
  status: Order["status"];
  lines: { sku: string; quantity: number }[];
  totalItems: number;
  placedAt: string;
  cancellationReason: string | null;
};

export type GetOrder = (req: GetOrderRequest) => Promise<OrderDetails | undefined>;

const toDetails = (order: Order): OrderDetails => ({
  id: order.id,
  customerId: order.customerId,
  status: order.status,
  lines: [...order.lines],
  totalItems: order.lines.reduce((total, line) => total + line.quantity, 0),
  placedAt: order.placedAt.toISOString(),
  cancellationReason: order.cancellationReason,
});

export function makeGetOrder(orders: OrderRepository): GetOrder {
  return async (req) => {
    const order = await orders.findById(req.orderId);
    return order && toDetails(order);
  };
}
