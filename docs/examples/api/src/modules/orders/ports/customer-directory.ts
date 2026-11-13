export interface CustomerDirectory {
  canPlaceOrders(customerId: string): Promise<boolean>;
}
