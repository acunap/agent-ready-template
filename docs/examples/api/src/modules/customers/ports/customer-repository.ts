import type { Customer } from "../domain/customer.ts";

export interface CustomerRepository {
  nextId(): string;
  findById(id: string): Promise<Customer | undefined>;
  emailTaken(email: string): Promise<boolean>;
  save(customer: Customer): Promise<void>;
}
