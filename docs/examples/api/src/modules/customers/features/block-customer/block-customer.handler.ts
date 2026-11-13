import type { Clock } from "../../../../shared/time/clock.ts";
import { blockCustomer } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import type { BlockCustomerRequest } from "./block-customer.request.ts";

export class CustomerNotFoundError extends Error {}

export type BlockCustomer = (req: BlockCustomerRequest) => Promise<void>;

export function makeBlockCustomer(deps: { customers: CustomerRepository; clock: Clock }): BlockCustomer {
  return async (req) => {
    const customer = await deps.customers.findById(req.customerId);
    if (!customer) throw new CustomerNotFoundError(req.customerId);
    await deps.customers.save(blockCustomer(customer, deps.clock.now()));
  };
}
