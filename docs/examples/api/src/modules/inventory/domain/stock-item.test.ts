import assert from "node:assert/strict";
import { test } from "node:test";
import { available, InvalidQuantityError, newStockItem, release, reserve, restock } from "./stock-item.ts";

test("reserving beyond stock leaves the item backordered", () => {
  const item = reserve(restock(newStockItem("A"), 2), 5);
  assert.equal(available(item), -3);
});

test("releasing never drops reserved below zero", () => {
  assert.equal(release(reserve(newStockItem("A"), 1), 5).reserved, 0);
});

test("quantities must be positive integers", () => {
  assert.throws(() => restock(newStockItem("A"), 0), InvalidQuantityError);
  assert.throws(() => reserve(newStockItem("A"), 1.5), InvalidQuantityError);
});
