export type OrderLineData = { sku: string; quantity: number };

export type OrderPlaced = {
  type: "orders.order-placed";
  orderId: string;
  customerId: string;
  lines: OrderLineData[];
  occurredAt: string;
};

export type OrderCancelled = {
  type: "orders.order-cancelled";
  orderId: string;
  lines: OrderLineData[];
  reason: string;
  occurredAt: string;
};

export type OrderEvent = OrderPlaced | OrderCancelled;
