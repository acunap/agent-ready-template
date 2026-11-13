import type { HttpRoute } from "../../../../shared/http/route.ts";
import { InvalidCustomerError } from "../../domain/customer.ts";
import { EmailAlreadyTakenError, type RegisterCustomer } from "./register-customer.handler.ts";
import type { RegisterCustomerRequest } from "./register-customer.request.ts";

export function registerCustomerEndpoint(registerCustomer: RegisterCustomer): HttpRoute {
  return {
    method: "POST",
    path: "/customers",
    async handle(req) {
      try {
        return { status: 201, body: await registerCustomer(req.body as RegisterCustomerRequest) };
      } catch (e) {
        if (e instanceof InvalidCustomerError) return { status: 422, body: { error: e.message } };
        if (e instanceof EmailAlreadyTakenError) return { status: 409, body: { error: "email already registered" } };
        throw e;
      }
    },
  };
}
