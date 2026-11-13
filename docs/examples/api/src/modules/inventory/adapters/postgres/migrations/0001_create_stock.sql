create schema if not exists inventory;

create table inventory.stock_items (
  sku      text    primary key,
  on_hand  integer not null check (on_hand >= 0),
  reserved integer not null check (reserved >= 0)
);
