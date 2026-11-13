import type { Clock } from "../../../../shared/time/clock.ts";
import { registerCustomer } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import type { RegisterCustomerRequest } from "./register-customer.request.ts";

export class EmailAlreadyTakenError extends Error {}

export type RegisterCustomer = (req: RegisterCustomerRequest) => Promise<{ customerId: string }>;

export function makeRegisterCustomer(deps: { customers: CustomerRepository; clock: Clock }): RegisterCustomer {
  return async (req) => {
    const customer = registerCustomer({ id: deps.customers.nextId(), name: req.name, email: req.email, now: deps.clock.now() });
    if (await deps.customers.emailTaken(customer.email)) throw new EmailAlreadyTakenError(customer.email);
    await deps.customers.save(customer);
    return { customerId: customer.id };
  };
}
