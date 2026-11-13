import type { EventSubscriber } from "../../../../shared/events/event-bus.ts";
import type { OrderPlaced } from "../../../orders/orders.module.ts";
import type { ReserveStockForOrder } from "./reserve-stock-for-order.handler.ts";

export function reserveStockForOrderSubscriber(reserveStockForOrder: ReserveStockForOrder): EventSubscriber {
  return {
    event: "orders.order-placed",
    async handle(event) {
      const placed = event as OrderPlaced;
      await reserveStockForOrder({ orderId: placed.orderId, lines: placed.lines });
    },
  };
}
