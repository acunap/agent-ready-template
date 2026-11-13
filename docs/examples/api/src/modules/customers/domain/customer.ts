export type Customer = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly registeredAt: Date;
  readonly blockedAt: Date | null;
};

export class InvalidCustomerError extends Error {}
export class CustomerAlreadyBlockedError extends Error {}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function registerCustomer(input: { id: string; name: string; email: string; now: Date }): Customer {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length === 0) throw new InvalidCustomerError("Name is required");
  if (!EMAIL.test(email)) throw new InvalidCustomerError(`Invalid email ${input.email}`);
  return { id: input.id, name, email, registeredAt: input.now, blockedAt: null };
}

export function blockCustomer(customer: Customer, now: Date): Customer {
  if (customer.blockedAt !== null) throw new CustomerAlreadyBlockedError(customer.id);
  return { ...customer, blockedAt: now };
}

export function canPlaceOrders(customer: Customer): boolean {
  return customer.blockedAt === null;
}
