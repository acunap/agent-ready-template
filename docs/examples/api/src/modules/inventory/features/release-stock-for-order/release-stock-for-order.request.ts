export type ReleaseStockForOrderRequest = { orderId: string; lines: { sku: string; quantity: number }[] };
