import assert from "node:assert/strict";
import { test } from "node:test";
import { type Customer, InvalidCustomerError } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import { EmailAlreadyTakenError, makeRegisterCustomer } from "./register-customer.handler.ts";

const now = new Date("2026-01-01T10:00:00Z");
const clock = { now: () => now };

function fakeCustomers(seed: Customer[] = []) {
  const rows = new Map(seed.map((c) => [c.id, c]));
  const customers: CustomerRepository = {
    nextId: () => "c-1",
    findById: async (id) => rows.get(id),
    emailTaken: async (email) => [...rows.values()].some((c) => c.email === email),
    save: async (customer) => void rows.set(customer.id, customer),
  };
  return { rows, customers };
}

test("registers a customer with a normalised email", async () => {
  const { rows, customers } = fakeCustomers();
  const { customerId } = await makeRegisterCustomer({ customers, clock })({ name: " Ada ", email: "Ada@Example.com" });
  assert.equal(rows.get(customerId)?.email, "ada@example.com");
});

test("rejects an email already in use", async () => {
  const { rows, customers } = fakeCustomers([{ id: "c-0", name: "Ada", email: "ada@example.com", registeredAt: now, blockedAt: null }]);
  await assert.rejects(makeRegisterCustomer({ customers, clock })({ name: "Ada", email: "ada@example.com" }), EmailAlreadyTakenError);
  assert.equal(rows.size, 1);
});

test("rejects an invalid email", async () => {
  const { customers } = fakeCustomers();
  await assert.rejects(makeRegisterCustomer({ customers, clock })({ name: "Ada", email: "not-an-email" }), InvalidCustomerError);
});
