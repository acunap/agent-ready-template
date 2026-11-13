import type { Sql } from "../../../../shared/database/sql.ts";
import type { StockItem } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";

type StockRow = { sku: string; on_hand: number; reserved: number };

export function postgresStockRepository(sql: Sql): StockRepository {
  return {
    async findBySkus(skus) {
      const rows = await sql<StockRow[]>`
        select sku, on_hand, reserved from inventory.stock_items where sku = any(${skus}) for update
      `;
      return rows.map((r): StockItem => ({ sku: r.sku, onHand: r.on_hand, reserved: r.reserved }));
    },
    async save(items) {
      for (const item of items) {
        await sql`
          insert into inventory.stock_items (sku, on_hand, reserved)
          values (${item.sku}, ${item.onHand}, ${item.reserved})
          on conflict (sku) do update set on_hand = excluded.on_hand, reserved = excluded.reserved
        `;
      }
    },
  };
}
