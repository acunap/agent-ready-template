import type { Sql } from "../../shared/database/sql.ts";
import type { EventSubscriber } from "../../shared/events/event-bus.ts";
import type { HttpRoute } from "../../shared/http/route.ts";
import { postgresStockRepository } from "./adapters/postgres/stock-repository.ts";
import { getStockEndpoint } from "./features/get-stock/get-stock.endpoint.ts";
import { makeGetStock } from "./features/get-stock/get-stock.handler.ts";
import { makeReleaseStockForOrder } from "./features/release-stock-for-order/release-stock-for-order.handler.ts";
import { releaseStockForOrderSubscriber } from "./features/release-stock-for-order/release-stock-for-order.subscriber.ts";
import { makeReserveStockForOrder } from "./features/reserve-stock-for-order/reserve-stock-for-order.handler.ts";
import { reserveStockForOrderSubscriber } from "./features/reserve-stock-for-order/reserve-stock-for-order.subscriber.ts";
import { restockEndpoint } from "./features/restock/restock.endpoint.ts";
import { makeRestock } from "./features/restock/restock.handler.ts";

export function createInventoryModule(deps: { sql: Sql }): { routes: HttpRoute[]; subscribers: EventSubscriber[] } {
  const stock = postgresStockRepository(deps.sql);
  return {
    routes: [restockEndpoint(makeRestock(stock)), getStockEndpoint(makeGetStock(stock))],
    subscribers: [
      reserveStockForOrderSubscriber(makeReserveStockForOrder(stock)),
      releaseStockForOrderSubscriber(makeReleaseStockForOrder(stock)),
    ],
  };
}
