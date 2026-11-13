import type { StockItem } from "../domain/stock-item.ts";

export interface StockRepository {
  findBySkus(skus: string[]): Promise<StockItem[]>;
  save(items: StockItem[]): Promise<void>;
}
