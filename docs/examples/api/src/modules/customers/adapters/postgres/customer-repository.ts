import { randomUUID } from "node:crypto";
import type { Sql } from "../../../../shared/database/sql.ts";
import type { Customer } from "../../domain/customer.ts";
import type { CustomerRepository } from "../../ports/customer-repository.ts";

type CustomerRow = { id: string; name: string; email: string; registered_at: Date; blocked_at: Date | null };

const toCustomer = (row: CustomerRow): Customer => ({
  id: row.id,
  name: row.name,
  email: row.email,
  registeredAt: row.registered_at,
  blockedAt: row.blocked_at,
});

export function postgresCustomerRepository(sql: Sql): CustomerRepository {
  return {
    nextId: () => randomUUID(),
    async findById(id) {
      const [row] = await sql<CustomerRow[]>`
        select id, name, email, registered_at, blocked_at from customers.customers where id = ${id}
      `;
      return row && toCustomer(row);
    },
    async emailTaken(email) {
      const [row] = await sql<{ taken: boolean }[]>`
        select exists (select 1 from customers.customers where email = ${email}) as taken
      `;
      return row!.taken;
    },
    async save(c) {
      await sql`
        insert into customers.customers (id, name, email, registered_at, blocked_at)
        values (${c.id}, ${c.name}, ${c.email}, ${c.registeredAt}, ${c.blockedAt})
        on conflict (id) do update set name = excluded.name, email = excluded.email, blocked_at = excluded.blocked_at
      `;
    },
  };
}
