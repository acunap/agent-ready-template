import type { HttpRoute } from "../../../../shared/http/route.ts";
import type { GetCustomer } from "./get-customer.handler.ts";

export function getCustomerEndpoint(getCustomer: GetCustomer): HttpRoute {
  return {
    method: "GET",
    path: "/customers/:customerId",
    async handle(req) {
      const view = await getCustomer({ customerId: req.params.customerId });
      return view ? { status: 200, body: view } : { status: 404, body: { error: "customer not found" } };
    },
  };
}
