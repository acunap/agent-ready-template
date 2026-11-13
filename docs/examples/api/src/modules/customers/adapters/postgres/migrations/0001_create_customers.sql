create schema if not exists customers;

create table customers.customers (
  id            uuid primary key,
  name          text        not null,
  email         text        not null unique,
  registered_at timestamptz not null,
  blocked_at    timestamptz
);
