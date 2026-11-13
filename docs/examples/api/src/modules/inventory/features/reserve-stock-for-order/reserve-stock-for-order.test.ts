import assert from "node:assert/strict";
import { test } from "node:test";
import type { StockItem } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import { makeReserveStockForOrder } from "./reserve-stock-for-order.handler.ts";

function fakeStock(seed: StockItem[] = []) {
  const rows = new Map(seed.map((i) => [i.sku, i]));
  const stock: StockRepository = {
    findBySkus: async (skus) => skus.flatMap((sku) => rows.get(sku) ?? []),
    save: async (items) => items.forEach((item) => rows.set(item.sku, item)),
  };
  return { rows, stock };
}

test("reserves every line of the order", async () => {
  const { rows, stock } = fakeStock([{ sku: "A", onHand: 5, reserved: 0 }]);
  await makeReserveStockForOrder(stock)({ orderId: "o-1", lines: [{ sku: "A", quantity: 2 }, { sku: "B", quantity: 1 }] });
  assert.equal(rows.get("A")?.reserved, 2);
  assert.deepEqual(rows.get("B"), { sku: "B", onHand: 0, reserved: 1 });
});
