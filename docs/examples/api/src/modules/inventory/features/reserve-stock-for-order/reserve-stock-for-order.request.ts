export type ReserveStockForOrderRequest = { orderId: string; lines: { sku: string; quantity: number }[] };
