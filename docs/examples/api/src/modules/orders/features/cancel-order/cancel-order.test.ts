import assert from "node:assert/strict";
import { test } from "node:test";
import { type Order, OrderNotCancellableError } from "../../domain/order.ts";
import type { OrderEvent } from "../../domain/order-events.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";
import { makeCancelOrder, OrderNotFoundError } from "./cancel-order.handler.ts";

const now = new Date("2026-01-01T10:00:00Z");
const placed: Order = {
  id: "o-1", customerId: "c-1", lines: [{ sku: "A", quantity: 2 }],
  status: "placed", placedAt: now, cancelledAt: null, cancellationReason: null,
};

function setup(seed: Order[]) {
  const rows = new Map(seed.map((o) => [o.id, o]));
  const published: OrderEvent[] = [];
  const orders: OrderRepository = {
    nextId: () => "o-new",
    findById: async (id) => rows.get(id),
    listByCustomer: async () => ({ items: [], total: 0 }),
    save: async (order) => void rows.set(order.id, order),
  };
  const cancelOrder = makeCancelOrder({ orders, events: { publish: async (event) => void published.push(event) }, clock: { now: () => now } });
  return { rows, published, cancelOrder };
}

test("cancels a placed order and publishes OrderCancelled", async () => {
  const { rows, published, cancelOrder } = setup([placed]);
  await cancelOrder({ orderId: "o-1", reason: "changed my mind" });
  assert.equal(rows.get("o-1")?.status, "cancelled");
  assert.equal(published[0]?.type, "orders.order-cancelled");
});

test("fails for an unknown order", async () => {
  const { cancelOrder } = setup([]);
  await assert.rejects(cancelOrder({ orderId: "o-9", reason: "x" }), OrderNotFoundError);
});

test("a cancelled order publishes nothing the second time", async () => {
  const { published, cancelOrder } = setup([{ ...placed, status: "cancelled" }]);
  await assert.rejects(cancelOrder({ orderId: "o-1", reason: "x" }), OrderNotCancellableError);
  assert.equal(published.length, 0);
});
