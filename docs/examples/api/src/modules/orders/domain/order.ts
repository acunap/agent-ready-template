import type { OrderCancelled, OrderPlaced } from "./order-events.ts";

export type OrderLine = { readonly sku: string; readonly quantity: number };

export type Order = {
  readonly id: string;
  readonly customerId: string;
  readonly lines: readonly OrderLine[];
  readonly status: "placed" | "cancelled";
  readonly placedAt: Date;
  readonly cancelledAt: Date | null;
  readonly cancellationReason: string | null;
};

export class InvalidOrderError extends Error {}
export class OrderNotCancellableError extends Error {}

export function placeOrder(input: { id: string; customerId: string; lines: OrderLine[]; now: Date }): { order: Order; event: OrderPlaced } {
  if (input.lines.length === 0) throw new InvalidOrderError("An order needs at least one line");
  const skus = new Set<string>();
  for (const line of input.lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) throw new InvalidOrderError(`Invalid quantity ${line.quantity} for ${line.sku}`);
    if (skus.has(line.sku)) throw new InvalidOrderError(`Duplicate line for ${line.sku}`);
    skus.add(line.sku);
  }
  const order: Order = {
    id: input.id,
    customerId: input.customerId,
    lines: input.lines,
    status: "placed",
    placedAt: input.now,
    cancelledAt: null,
    cancellationReason: null,
  };
  return {
    order,
    event: { type: "orders.order-placed", orderId: order.id, customerId: order.customerId, lines: [...order.lines], occurredAt: input.now.toISOString() },
  };
}

export function cancelOrder(order: Order, input: { reason: string; now: Date }): { order: Order; event: OrderCancelled } {
  if (order.status !== "placed") throw new OrderNotCancellableError(`Order ${order.id} is ${order.status}`);
  const reason = input.reason.trim();
  if (reason.length === 0) throw new InvalidOrderError("A cancellation reason is required");
  const cancelled: Order = { ...order, status: "cancelled", cancelledAt: input.now, cancellationReason: reason };
  return {
    order: cancelled,
    event: { type: "orders.order-cancelled", orderId: order.id, lines: [...order.lines], reason, occurredAt: input.now.toISOString() },
  };
}
