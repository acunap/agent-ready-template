import type { Customer } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";
import type { GetCustomerRequest } from "./get-customer.request.ts";

export type CustomerView = {
  id: string;
  name: string;
  email: string;
  status: "active" | "blocked";
  registeredAt: string;
};

export type GetCustomer = (req: GetCustomerRequest) => Promise<CustomerView | undefined>;

const toView = (customer: Customer): CustomerView => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  status: customer.blockedAt === null ? "active" : "blocked",
  registeredAt: customer.registeredAt.toISOString(),
});

export function makeGetCustomer(customers: CustomerRepository): GetCustomer {
  return async (req) => {
    const customer = await customers.findById(req.customerId);
    return customer && toView(customer);
  };
}
