import { newStockItem, reserve } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import type { ReserveStockForOrderRequest } from "./reserve-stock-for-order.request.ts";

export type ReserveStockForOrder = (req: ReserveStockForOrderRequest) => Promise<void>;

export function makeReserveStockForOrder(stock: StockRepository): ReserveStockForOrder {
  return async (req) => {
    const existing = new Map((await stock.findBySkus(req.lines.map((l) => l.sku))).map((i) => [i.sku, i]));
    const updated = req.lines.map((line) => reserve(existing.get(line.sku) ?? newStockItem(line.sku), line.quantity));
    await stock.save(updated);
  };
}
