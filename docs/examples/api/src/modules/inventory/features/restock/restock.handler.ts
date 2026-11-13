import { newStockItem, restock } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import type { RestockRequest } from "./restock.request.ts";

export type Restock = (req: RestockRequest) => Promise<{ sku: string; onHand: number }>;

export function makeRestock(stock: StockRepository): Restock {
  return async (req) => {
    const [current] = await stock.findBySkus([req.sku]);
    const item = restock(current ?? newStockItem(req.sku), req.quantity);
    await stock.save([item]);
    return { sku: item.sku, onHand: item.onHand };
  };
}
