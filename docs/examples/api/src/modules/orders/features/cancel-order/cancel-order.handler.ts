import type { Clock } from "../../../../shared/time/clock.ts";
import { cancelOrder } from "../../domain/order.ts";
import type { OrderEventPublisher } from "../../ports/order-event-publisher.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";
import type { CancelOrderRequest } from "./cancel-order.request.ts";

export class OrderNotFoundError extends Error {}

export type CancelOrder = (req: CancelOrderRequest) => Promise<void>;

export function makeCancelOrder(deps: { orders: OrderRepository; events: OrderEventPublisher; clock: Clock }): CancelOrder {
  return async (req) => {
    const current = await deps.orders.findById(req.orderId);
    if (!current) throw new OrderNotFoundError(req.orderId);
    const { order, event } = cancelOrder(current, { reason: req.reason, now: deps.clock.now() });
    await deps.orders.save(order);
    await deps.events.publish(event);
  };
}
