import type { EventSubscriber } from "../../../../shared/events/event-bus.ts";
import type { OrderCancelled } from "../../../orders/orders.module.ts";
import type { ReleaseStockForOrder } from "./release-stock-for-order.handler.ts";

export function releaseStockForOrderSubscriber(releaseStockForOrder: ReleaseStockForOrder): EventSubscriber {
  return {
    event: "orders.order-cancelled",
    async handle(event) {
      const cancelled = event as OrderCancelled;
      await releaseStockForOrder({ orderId: cancelled.orderId, lines: cancelled.lines });
    },
  };
}
