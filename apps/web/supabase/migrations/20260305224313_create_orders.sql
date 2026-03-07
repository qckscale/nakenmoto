-- Orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  customer_email text not null,
  customer_name text not null,
  shipping_address jsonb not null,
  total_amount integer not null,
  currency text not null default 'SEK',
  klarna_order_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order items table
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_slug text not null,
  product_image text not null,
  size text not null,
  quantity integer not null,
  unit_price integer not null,
  created_at timestamptz not null default now()
);

-- Enable RLS (server-side only via service role key)
alter table orders enable row level security;
alter table order_items enable row level security;

-- Auto-update updated_at on orders
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at();
