export type StockItem = {
  readonly sku: string;
  readonly onHand: number;
  readonly reserved: number;
};

export class InvalidQuantityError extends Error {}

function assertQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1) throw new InvalidQuantityError(`Invalid quantity ${quantity}`);
}

export function newStockItem(sku: string): StockItem {
  return { sku, onHand: 0, reserved: 0 };
}

export function available(item: StockItem): number {
  return item.onHand - item.reserved;
}

export function restock(item: StockItem, quantity: number): StockItem {
  assertQuantity(quantity);
  return { ...item, onHand: item.onHand + quantity };
}

export function reserve(item: StockItem, quantity: number): StockItem {
  assertQuantity(quantity);
  return { ...item, reserved: item.reserved + quantity };
}

export function release(item: StockItem, quantity: number): StockItem {
  assertQuantity(quantity);
  return { ...item, reserved: Math.max(item.reserved - quantity, 0) };
}
