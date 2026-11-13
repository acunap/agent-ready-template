import assert from "node:assert/strict";
import { test } from "node:test";
import type { Customer } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import { makeGetCustomer } from "./get-customer.handler.ts";

const now = new Date("2026-01-01T10:00:00Z");
const ada: Customer = { id: "c-1", name: "Ada", email: "ada@example.com", registeredAt: now, blockedAt: now };
const customers: CustomerRepository = {
  nextId: () => "c-new",
  findById: async (id) => (id === ada.id ? ada : undefined),
  emailTaken: async () => false,
  save: async () => {},
};
const getCustomer = makeGetCustomer(customers);

test("returns the view of an existing customer", async () => {
  assert.deepEqual(await getCustomer({ customerId: "c-1" }), {
    id: "c-1", name: "Ada", email: "ada@example.com", status: "blocked", registeredAt: "2026-01-01T10:00:00.000Z",
  });
});

test("returns nothing for an unknown customer", async () => {
  assert.equal(await getCustomer({ customerId: "c-9" }), undefined);
});
