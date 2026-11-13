import { release } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import type { ReleaseStockForOrderRequest } from "./release-stock-for-order.request.ts";

export type ReleaseStockForOrder = (req: ReleaseStockForOrderRequest) => Promise<void>;

export function makeReleaseStockForOrder(stock: StockRepository): ReleaseStockForOrder {
  return async (req) => {
    const existing = new Map((await stock.findBySkus(req.lines.map((l) => l.sku))).map((i) => [i.sku, i]));
    const updated = req.lines.flatMap((line) => {
      const item = existing.get(line.sku);
      return item ? [release(item, line.quantity)] : [];
    });
    await stock.save(updated);
  };
}
