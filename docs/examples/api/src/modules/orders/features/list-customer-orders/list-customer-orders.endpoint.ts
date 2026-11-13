import type { HttpRoute } from "../../../../shared/http/route.ts";
import type { ListCustomerOrders } from "./list-customer-orders.handler.ts";

const toInt = (value: string | undefined) => (value === undefined ? undefined : Number.parseInt(value, 10));

export function listCustomerOrdersEndpoint(listCustomerOrders: ListCustomerOrders): HttpRoute {
  return {
    method: "GET",
    path: "/customers/:customerId/orders",
    async handle(req) {
      const page = await listCustomerOrders({
        customerId: req.params.customerId,
        limit: toInt(req.query.limit),
        offset: toInt(req.query.offset),
      });
      return { status: 200, body: page };
    },
  };
}
