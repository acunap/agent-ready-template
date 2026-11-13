import assert from "node:assert/strict";
import { test } from "node:test";
import type { StockItem } from "../../domain/stock-item.ts";
import type { StockRepository } from "../../ports/stock-repository.ts";
import { makeGetStock } from "./get-stock.handler.ts";

const item: StockItem = { sku: "A", onHand: 2, reserved: 3 };
const stock: StockRepository = {
  findBySkus: async (skus) => (skus.includes(item.sku) ? [item] : []),
  save: async () => {},
};
const getStock = makeGetStock(stock);

test("returns the level of a stocked sku, flagging a backorder", async () => {
  assert.deepEqual(await getStock({ sku: "A" }), { sku: "A", onHand: 2, reserved: 3, available: -1, backordered: true });
});

test("returns nothing for an unknown sku", async () => assert.equal(await getStock({ sku: "Z" }), undefined));
