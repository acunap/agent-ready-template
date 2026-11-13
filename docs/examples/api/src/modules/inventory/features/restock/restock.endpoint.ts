import type { HttpRoute } from "../../../../shared/http/route.ts";
import { InvalidQuantityError } from "../../domain/stock-item.ts";
import type { Restock } from "./restock.handler.ts";

export function restockEndpoint(restock: Restock): HttpRoute {
  return {
    method: "POST",
    path: "/stock/:sku/restock",
    async handle(req) {
      try {
        const { quantity } = req.body as { quantity: number };
        return { status: 200, body: await restock({ sku: req.params.sku, quantity }) };
      } catch (e) {
        if (e instanceof InvalidQuantityError) return { status: 422, body: { error: e.message } };
        throw e;
      }
    },
  };
}
