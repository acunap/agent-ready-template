import assert from "node:assert/strict";
import { test } from "node:test";
import type { Customer } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import { makeCheckOrderingEligibility } from "./check-ordering-eligibility.handler.ts";

const now = new Date("2026-01-01T10:00:00Z");
const active: Customer = { id: "c-1", name: "Ada", email: "ada@example.com", registeredAt: now, blockedAt: null };
const blocked: Customer = { ...active, id: "c-2", blockedAt: now };
const rows = new Map([active, blocked].map((c) => [c.id, c]));
const customers: CustomerRepository = {
  nextId: () => "c-new",
  findById: async (id) => rows.get(id),
  emailTaken: async () => false,
  save: async () => {},
};
const check = makeCheckOrderingEligibility(customers);

test("an active customer can order", async () => assert.equal(await check({ customerId: "c-1" }), true));
test("a blocked customer cannot order", async () => assert.equal(await check({ customerId: "c-2" }), false));
test("an unknown customer cannot order", async () => assert.equal(await check({ customerId: "c-9" }), false));
