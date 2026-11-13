import assert from "node:assert/strict";
import { test } from "node:test";
import type { Order } from "../../domain/order.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";
import { makeGetOrder } from "./get-order.handler.ts";

const order: Order = {
  id: "o-1", customerId: "c-1", lines: [{ sku: "A", quantity: 2 }, { sku: "B", quantity: 1 }],
  status: "placed", placedAt: new Date("2026-01-01T10:00:00Z"), cancelledAt: null, cancellationReason: null,
};
const orders: OrderRepository = {
  nextId: () => "o-new",
  findById: async (id) => (id === order.id ? order : undefined),
  listByCustomer: async () => ({ items: [], total: 0 }),
  save: async () => {},
};
const getOrder = makeGetOrder(orders);

test("returns the details of an existing order", async () => {
  assert.deepEqual(await getOrder({ orderId: "o-1" }), {
    id: "o-1", customerId: "c-1", status: "placed", lines: [{ sku: "A", quantity: 2 }, { sku: "B", quantity: 1 }],
    totalItems: 3, placedAt: "2026-01-01T10:00:00.000Z", cancellationReason: null,
  });
});

test("returns nothing for an unknown order", async () => assert.equal(await getOrder({ orderId: "o-9" }), undefined));
