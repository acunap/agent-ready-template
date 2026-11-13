import { available, type StockItem } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import type { GetStockRequest } from "./get-stock.request.ts";

export type StockLevel = {
  sku: string;
  onHand: number;
  reserved: number;
  available: number;
  backordered: boolean;
};

export type GetStock = (req: GetStockRequest) => Promise<StockLevel | undefined>;

const toLevel = (item: StockItem): StockLevel => ({
  sku: item.sku,
  onHand: item.onHand,
  reserved: item.reserved,
  available: available(item),
  backordered: available(item) < 0,
});

export function makeGetStock(stock: StockRepository): GetStock {
  return async (req) => {
    const [item] = await stock.findBySkus([req.sku]);
    return item && toLevel(item);
  };
}
