import type { Sql } from "../../shared/database/sql.ts";
import type { EventBus } from "../../shared/events/event-bus.ts";
import type { HttpRoute } from "../../shared/http/route.ts";
import type { Clock } from "../../shared/time/clock.ts";
import type { CustomersApi } from "../customers/customers.module.ts";
import { customersModuleDirectory } from "./adapters/customers-module/customer-directory.ts";
import { eventBusOrderEventPublisher } from "./adapters/event-bus/order-event-publisher.ts";
import { postgresOrderRepository } from "./adapters/postgres/order-repository.ts";
import { cancelOrderEndpoint } from "./features/cancel-order/cancel-order.endpoint.ts";
import { makeCancelOrder } from "./features/cancel-order/cancel-order.handler.ts";
import { getOrderEndpoint } from "./features/get-order/get-order.endpoint.ts";
import { makeGetOrder } from "./features/get-order/get-order.handler.ts";
import { listCustomerOrdersEndpoint } from "./features/list-customer-orders/list-customer-orders.endpoint.ts";
import { makeListCustomerOrders } from "./features/list-customer-orders/list-customer-orders.handler.ts";
import { placeOrderEndpoint } from "./features/place-order/place-order.endpoint.ts";
import { makePlaceOrder } from "./features/place-order/place-order.handler.ts";

export type { OrderCancelled, OrderPlaced } from "./domain/order-events.ts";

export function createOrdersModule(deps: { sql: Sql; events: EventBus; clock: Clock; customers: CustomersApi }): { routes: HttpRoute[] } {
  const orders = postgresOrderRepository(deps.sql);
  const events = eventBusOrderEventPublisher(deps.events);
  const customers = customersModuleDirectory(deps.customers);
  return {
    routes: [
      placeOrderEndpoint(makePlaceOrder({ orders, customers, events, clock: deps.clock })),
      cancelOrderEndpoint(makeCancelOrder({ orders, events, clock: deps.clock })),
      getOrderEndpoint(makeGetOrder(orders)),
      listCustomerOrdersEndpoint(makeListCustomerOrders(orders)),
    ],
  };
}
