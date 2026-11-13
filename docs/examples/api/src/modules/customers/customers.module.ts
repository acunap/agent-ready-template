import type { Sql } from "../../shared/database/sql.ts";
import type { HttpRoute } from "../../shared/http/route.ts";
import type { Clock } from "../../shared/time/clock.ts";
import { postgresCustomerRepository } from "./adapters/postgres/customer-repository.ts";
import { blockCustomerEndpoint } from "./features/block-customer/block-customer.endpoint.ts";
import { makeBlockCustomer } from "./features/block-customer/block-customer.handler.ts";
import { makeCheckOrderingEligibility } from "./features/check-ordering-eligibility/check-ordering-eligibility.handler.ts";
import { getCustomerEndpoint } from "./features/get-customer/get-customer.endpoint.ts";
import { makeGetCustomer } from "./features/get-customer/get-customer.handler.ts";
import { registerCustomerEndpoint } from "./features/register-customer/register-customer.endpoint.ts";
import { makeRegisterCustomer } from "./features/register-customer/register-customer.handler.ts";

export type CustomersApi = {
  canPlaceOrders(customerId: string): Promise<boolean>;
};

export function createCustomersModule(deps: { sql: Sql; clock: Clock }): { api: CustomersApi; routes: HttpRoute[] } {
  const customers = postgresCustomerRepository(deps.sql);
  const checkOrderingEligibility = makeCheckOrderingEligibility(customers);
  return {
    api: {
      canPlaceOrders: (customerId) => checkOrderingEligibility({ customerId }),
    },
    routes: [
      registerCustomerEndpoint(makeRegisterCustomer({ customers, clock: deps.clock })),
      blockCustomerEndpoint(makeBlockCustomer({ customers, clock: deps.clock })),
      getCustomerEndpoint(makeGetCustomer(customers)),
    ],
  };
}
