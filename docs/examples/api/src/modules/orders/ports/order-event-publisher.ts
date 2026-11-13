import type { OrderEvent } from "../domain/order-events.ts";

export interface OrderEventPublisher {
  publish(event: OrderEvent): Promise<void>;
}
