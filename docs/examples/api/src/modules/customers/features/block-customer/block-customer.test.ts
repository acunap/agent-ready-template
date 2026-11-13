import assert from "node:assert/strict";
import { test } from "node:test";
import { type Customer, CustomerAlreadyBlockedError } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import { CustomerNotFoundError, makeBlockCustomer } from "./block-customer.handler.ts";

const now = new Date("2026-01-01T10:00:00Z");
const clock = { now: () => now };
const ada: Customer = { id: "c-1", name: "Ada", email: "ada@example.com", registeredAt: now, blockedAt: null };

function fakeCustomers(seed: Customer[] = []) {
  const rows = new Map(seed.map((c) => [c.id, c]));
  const customers: CustomerRepository = {
    nextId: () => "c-new",
    findById: async (id) => rows.get(id),
    emailTaken: async () => false,
    save: async (customer) => void rows.set(customer.id, customer),
  };
  return { rows, customers };
}

test("blocks an active customer", async () => {
  const { rows, customers } = fakeCustomers([ada]);
  await makeBlockCustomer({ customers, clock })({ customerId: "c-1" });
  assert.deepEqual(rows.get("c-1")?.blockedAt, now);
});

test("fails for an unknown customer", async () => {
  const { customers } = fakeCustomers();
  await assert.rejects(makeBlockCustomer({ customers, clock })({ customerId: "c-9" }), CustomerNotFoundError);
});

test("fails when the customer is already blocked", async () => {
  const { customers } = fakeCustomers([{ ...ada, blockedAt: now }]);
  await assert.rejects(makeBlockCustomer({ customers, clock })({ customerId: "c-1" }), CustomerAlreadyBlockedError);
});
