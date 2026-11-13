import assert from "node:assert/strict";
import { test } from "node:test";
import type { Order } from "../../domain/order.ts";
import type { OrderEvent } from "../../domain/order-events.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";
import { CustomerCannotOrderError, makePlaceOrder } from "./place-order.handler.ts";

function setup(customersWhoCanOrder: string[]) {
  const rows = new Map<string, Order>();
  const published: OrderEvent[] = [];
  const orders: OrderRepository = {
    nextId: () => "o-1",
    findById: async (id) => rows.get(id),
    listByCustomer: async () => ({ items: [], total: 0 }),
    save: async (order) => void rows.set(order.id, order),
  };
  const placeOrder = makePlaceOrder({
    orders,
    customers: { canPlaceOrders: async (id) => customersWhoCanOrder.includes(id) },
    events: { publish: async (event) => void published.push(event) },
    clock: { now: () => new Date("2026-01-01T10:00:00Z") },
  });
  return { rows, published, placeOrder };
}

test("saves the order and publishes OrderPlaced", async () => {
  const { rows, published, placeOrder } = setup(["c-1"]);
  const { orderId } = await placeOrder({ customerId: "c-1", lines: [{ sku: "A", quantity: 2 }] });
  assert.equal(rows.get(orderId)?.status, "placed");
  assert.equal(published[0]?.type, "orders.order-placed");
});

test("a customer who cannot order changes nothing", async () => {
  const { rows, published, placeOrder } = setup([]);
  await assert.rejects(placeOrder({ customerId: "c-9", lines: [{ sku: "A", quantity: 1 }] }), CustomerCannotOrderError);
  assert.deepEqual([rows.size, published.length], [0, 0]);
});
