import type { CustomersApi } from "../../../customers/customers.module.ts";
import type { CustomerDirectory } from "../../ports/customer-directory.ts";

export function customersModuleDirectory(customers: CustomersApi): CustomerDirectory {
  return { canPlaceOrders: (customerId) => customers.canPlaceOrders(customerId) };
}
