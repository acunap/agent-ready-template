import type { Clock } from "../../../../shared/time/clock.ts";
import { placeOrder } from "../../domain/order.ts";
import type { CustomerDirectory } from "../../ports/customer-directory.ts";
import type { OrderEventPublisher } from "../../ports/order-event-publisher.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";
import type { PlaceOrderRequest } from "./place-order.request.ts";

export class CustomerCannotOrderError extends Error {}

export type PlaceOrder = (req: PlaceOrderRequest) => Promise<{ orderId: string }>;

export function makePlaceOrder(deps: {
  orders: OrderRepository;
  customers: CustomerDirectory;
  events: OrderEventPublisher;
  clock: Clock;
}): PlaceOrder {
  return async (req) => {
    if (!(await deps.customers.canPlaceOrders(req.customerId))) throw new CustomerCannotOrderError(req.customerId);
    const { order, event } = placeOrder({ id: deps.orders.nextId(), customerId: req.customerId, lines: req.lines, now: deps.clock.now() });
    await deps.orders.save(order);
    await deps.events.publish(event);
    return { orderId: order.id };
  };
}
