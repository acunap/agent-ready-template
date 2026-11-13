create schema if not exists orders;

create table orders.orders (
  id                  uuid primary key,
  customer_id         uuid        not null,
  status              text        not null check (status in ('placed', 'cancelled')),
  placed_at           timestamptz not null,
  cancelled_at        timestamptz,
  cancellation_reason text
);
create index orders_customer_placed_idx on orders.orders (customer_id, placed_at desc);

create table orders.order_lines (
  order_id uuid    not null references orders.orders (id) on delete cascade,
  sku      text    not null,
  quantity integer not null check (quantity > 0),
  primary key (order_id, sku)
);
