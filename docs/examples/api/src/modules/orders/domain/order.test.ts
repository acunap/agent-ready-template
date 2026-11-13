import assert from "node:assert/strict";
import { test } from "node:test";
import { cancelOrder, InvalidOrderError, OrderNotCancellableError, placeOrder } from "./order.ts";

const now = new Date("2026-01-01T10:00:00Z");
const place = (lines = [{ sku: "A", quantity: 2 }]) => placeOrder({ id: "o-1", customerId: "c-1", lines, now });

test("placing emits OrderPlaced with the lines", () => {
  const { order, event } = place();
  assert.equal(order.status, "placed");
  assert.deepEqual(event, { type: "orders.order-placed", orderId: "o-1", customerId: "c-1", lines: [{ sku: "A", quantity: 2 }], occurredAt: now.toISOString() });
});

test("an order cannot have two lines for the same sku", () => {
  assert.throws(() => place([{ sku: "A", quantity: 1 }, { sku: "A", quantity: 1 }]), InvalidOrderError);
});

test("an order cannot have a non-positive quantity", () => {
  assert.throws(() => place([{ sku: "A", quantity: 0 }]), InvalidOrderError);
});

test("cancelling requires a reason", () => {
  assert.throws(() => cancelOrder(place().order, { reason: "  ", now }), InvalidOrderError);
});

test("a cancelled order cannot be cancelled again", () => {
  const { order } = cancelOrder(place().order, { reason: "changed my mind", now });
  assert.equal(order.status, "cancelled");
  assert.throws(() => cancelOrder(order, { reason: "again", now }), OrderNotCancellableError);
});
