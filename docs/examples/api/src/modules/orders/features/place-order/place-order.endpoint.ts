import type { HttpRoute } from "../../../../shared/http/route.ts";
import { InvalidOrderError } from "../../domain/order.ts";
import { CustomerCannotOrderError, type PlaceOrder } from "./place-order.handler.ts";
import type { PlaceOrderRequest } from "./place-order.request.ts";

export function placeOrderEndpoint(placeOrder: PlaceOrder): HttpRoute {
  return {
    method: "POST",
    path: "/orders",
    async handle(req) {
      try {
        return { status: 201, body: await placeOrder(req.body as PlaceOrderRequest) };
      } catch (e) {
        if (e instanceof InvalidOrderError) return { status: 422, body: { error: e.message } };
        if (e instanceof CustomerCannotOrderError) return { status: 403, body: { error: "customer cannot place orders" } };
        throw e;
      }
    },
  };
}
