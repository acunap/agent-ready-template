import { canPlaceOrders } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import type { CheckOrderingEligibilityRequest } from "./check-ordering-eligibility.request.ts";

export type CheckOrderingEligibility = (req: CheckOrderingEligibilityRequest) => Promise<boolean>;

export function makeCheckOrderingEligibility(customers: CustomerRepository): CheckOrderingEligibility {
  return async (req) => {
    const customer = await customers.findById(req.customerId);
    return customer !== undefined && canPlaceOrders(customer);
  };
}
