export type PlaceOrderRequest = {
  customerId: string;
  lines: { sku: string; quantity: number }[];
};
