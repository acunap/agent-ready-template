import assert from "node:assert/strict";
import { test } from "node:test";
import type { StockItem } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import { makeRestock } from "./restock.handler.ts";

function fakeStock(seed: StockItem[] = []) {
  const rows = new Map(seed.map((i) => [i.sku, i]));
  const stock: StockRepository = {
    findBySkus: async (skus) => skus.flatMap((sku) => rows.get(sku) ?? []),
    save: async (items) => items.forEach((item) => rows.set(item.sku, item)),
  };
  return { rows, stock };
}

test("adds to an existing item", async () => {
  const { stock } = fakeStock([{ sku: "A", onHand: 3, reserved: 1 }]);
  assert.deepEqual(await makeRestock(stock)({ sku: "A", quantity: 2 }), { sku: "A", onHand: 5 });
});

test("creates the item the first time a sku is restocked", async () => {
  const { rows, stock } = fakeStock();
  await makeRestock(stock)({ sku: "B", quantity: 4 });
  assert.deepEqual(rows.get("B"), { sku: "B", onHand: 4, reserved: 0 });
});
