import type { HttpRoute } from "../../../../shared/http/route.ts";
import type { GetOrder } from "./get-order.handler.ts";

export function getOrderEndpoint(getOrder: GetOrder): HttpRoute {
  return {
    method: "GET",
    path: "/orders/:orderId",
    async handle(req) {
      const summary = await getOrder({ orderId: req.params.orderId });
      return summary ? { status: 200, body: summary } : { status: 404, body: { error: "order not found" } };
    },
  };
}
