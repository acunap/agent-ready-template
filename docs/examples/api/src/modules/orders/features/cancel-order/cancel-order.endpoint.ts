import type { HttpRoute } from "../../../../shared/http/route.ts";
import { InvalidOrderError, OrderNotCancellableError } from "../../domain/order.ts";
import { type CancelOrder, OrderNotFoundError } from "./cancel-order.handler.ts";

export function cancelOrderEndpoint(cancelOrder: CancelOrder): HttpRoute {
  return {
    method: "POST",
    path: "/orders/:orderId/cancel",
    async handle(req) {
      try {
        const { reason } = req.body as { reason: string };
        await cancelOrder({ orderId: req.params.orderId, reason });
        return { status: 204, body: null };
      } catch (e) {
        if (e instanceof OrderNotFoundError) return { status: 404, body: { error: "order not found" } };
        if (e instanceof OrderNotCancellableError) return { status: 409, body: { error: e.message } };
        if (e instanceof InvalidOrderError) return { status: 422, body: { error: e.message } };
        throw e;
      }
    },
  };
}
