import assert from "node:assert/strict";
import { test } from "node:test";
import type { StockItem } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import { makeReleaseStockForOrder } from "./release-stock-for-order.handler.ts";

function fakeStock(seed: StockItem[] = []) {
  const rows = new Map(seed.map((i) => [i.sku, i]));
  const stock: StockRepository = {
    findBySkus: async (skus) => skus.flatMap((sku) => rows.get(sku) ?? []),
    save: async (items) => items.forEach((item) => rows.set(item.sku, item)),
  };
  return { rows, stock };
}

test("releases the reserved quantity of each line", async () => {
  const { rows, stock } = fakeStock([{ sku: "A", onHand: 5, reserved: 3 }]);
  await makeReleaseStockForOrder(stock)({ orderId: "o-1", lines: [{ sku: "A", quantity: 2 }] });
  assert.equal(rows.get("A")?.reserved, 1);
});

test("ignores skus inventory never tracked", async () => {
  const { rows, stock } = fakeStock();
  await makeReleaseStockForOrder(stock)({ orderId: "o-1", lines: [{ sku: "Z", quantity: 1 }] });
  assert.equal(rows.size, 0);
});
