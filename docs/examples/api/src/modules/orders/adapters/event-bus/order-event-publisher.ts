import type { EventBus } from "../../../../shared/events/event-bus.ts";
import type { OrderEventPublisher } from "../../ports/order-event-publisher.ts";

export function eventBusOrderEventPublisher(bus: EventBus): OrderEventPublisher {
  return { publish: (event) => bus.publish(event) };
}
