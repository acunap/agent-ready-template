import assert from "node:assert/strict";
import { test } from "node:test";
import type { Order } from "../../domain/order.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";
import { makeListCustomerOrders } from "./list-customer-orders.handler.ts";

const stored: Order[] = Array.from({ length: 150 }, (_, i) => ({
  id: `o-${i}`, customerId: "c-1", lines: [{ sku: "A", quantity: 2 }],
  status: "placed", placedAt: new Date("2026-01-01T10:00:00Z"), cancelledAt: null, cancellationReason: null,
}));
const orders: OrderRepository = {
  nextId: () => "o-new",
  findById: async (id) => stored.find((o) => o.id === id),
  listByCustomer: async (customerId, { limit, offset }) => {
    const matching = stored.filter((o) => o.customerId === customerId);
    return { items: matching.slice(offset, offset + limit), total: matching.length };
  },
  save: async () => {},
};
const list = makeListCustomerOrders(orders);

test("returns the first 20 orders as summaries by default", async () => {
  const page = await list({ customerId: "c-1" });
  assert.deepEqual([page.items.length, page.total], [20, 150]);
  assert.deepEqual(page.items[0], { id: "o-0", status: "placed", totalItems: 2, placedAt: "2026-01-01T10:00:00.000Z" });
});

test("caps the page size at 100 and floors a negative offset", async () => {
  const page = await list({ customerId: "c-1", limit: 1000, offset: -5 });
  assert.deepEqual([page.items.length, page.items[0]?.id], [100, "o-0"]);
});
