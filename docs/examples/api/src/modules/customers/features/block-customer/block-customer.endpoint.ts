import type { HttpRoute } from "../../../../shared/http/route.ts";
import { CustomerAlreadyBlockedError } from "../../domain/customer.ts";
import { type BlockCustomer, CustomerNotFoundError } from "./block-customer.handler.ts";

export function blockCustomerEndpoint(blockCustomer: BlockCustomer): HttpRoute {
  return {
    method: "POST",
    path: "/customers/:customerId/block",
    async handle(req) {
      try {
        await blockCustomer({ customerId: req.params.customerId });
        return { status: 204, body: null };
      } catch (e) {
        if (e instanceof CustomerNotFoundError) return { status: 404, body: { error: "customer not found" } };
        if (e instanceof CustomerAlreadyBlockedError) return { status: 409, body: { error: "customer already blocked" } };
        throw e;
      }
    },
  };
}
