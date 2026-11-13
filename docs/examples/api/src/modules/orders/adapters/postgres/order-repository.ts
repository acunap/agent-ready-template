import { randomUUID } from "node:crypto";
import type { Sql } from "../../../../shared/database/sql.ts";
import type { Order, OrderLine } from "../../domain/order.ts";
import type { OrderRepository } from "../../ports/order-repository.ts";

type OrderRow = {
  id: string;
  customer_id: string;
  status: Order["status"];
  placed_at: Date;
  cancelled_at: Date | null;
  cancellation_reason: string | null;
};
type LineRow = { order_id: string; sku: string; quantity: number };

const toOrder = (row: OrderRow, lines: OrderLine[]): Order => ({
  id: row.id,
  customerId: row.customer_id,
  lines,
  status: row.status,
  placedAt: row.placed_at,
  cancelledAt: row.cancelled_at,
  cancellationReason: row.cancellation_reason,
});

export function postgresOrderRepository(sql: Sql): OrderRepository {
  async function withLines(rows: OrderRow[]): Promise<Order[]> {
    if (rows.length === 0) return [];
    const lines = await sql<LineRow[]>`
      select order_id, sku, quantity from orders.order_lines where order_id = any(${rows.map((r) => r.id)}) order by sku
    `;
    return rows.map((row) =>
      toOrder(row, lines.filter((l) => l.order_id === row.id).map((l) => ({ sku: l.sku, quantity: l.quantity }))),
    );
  }

  return {
    nextId: () => randomUUID(),
    async findById(id) {
      const rows = await sql<OrderRow[]>`select * from orders.orders where id = ${id}`;
      const [order] = await withLines(rows);
      return order;
    },
    async listByCustomer(customerId, { limit, offset }) {
      const rows = await sql<OrderRow[]>`
        select * from orders.orders where customer_id = ${customerId}
        order by placed_at desc, id
        limit ${limit} offset ${offset}
      `;
      const [count] = await sql<{ total: number }[]>`select count(*)::int as total from orders.orders where customer_id = ${customerId}`;
      return { items: await withLines(rows), total: count!.total };
    },
    async save(order) {
      await sql`
        insert into orders.orders (id, customer_id, status, placed_at, cancelled_at, cancellation_reason)
        values (${order.id}, ${order.customerId}, ${order.status}, ${order.placedAt}, ${order.cancelledAt}, ${order.cancellationReason})
        on conflict (id) do update
          set status = excluded.status, cancelled_at = excluded.cancelled_at, cancellation_reason = excluded.cancellation_reason
      `;
      await sql`delete from orders.order_lines where order_id = ${order.id}`;
      for (const line of order.lines) {
        await sql`insert into orders.order_lines (order_id, sku, quantity) values (${order.id}, ${line.sku}, ${line.quantity})`;
      }
    },
  };
}
