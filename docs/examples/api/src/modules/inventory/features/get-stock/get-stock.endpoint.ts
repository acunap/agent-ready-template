import type { HttpRoute } from "../../../../shared/http/route.ts";
import type { GetStock } from "./get-stock.handler.ts";

export function getStockEndpoint(getStock: GetStock): HttpRoute {
  return {
    method: "GET",
    path: "/stock/:sku",
    async handle(req) {
      const level = await getStock({ sku: req.params.sku });
      return level ? { status: 200, body: level } : { status: 404, body: { error: "sku not stocked" } };
    },
  };
}
