-- Products table: prices and inventory (linked to Sanity by sanity_id)
create table products (
  id uuid primary key default gen_random_uuid(),
  sanity_id text unique not null,
  price_sek integer not null,
  price_eur integer not null,
  compare_at_price_sek integer,
  compare_at_price_eur integer,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product variants: size + stock per product
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  sku text unique,
  stock_count integer not null default 0,
  created_at timestamptz default now(),
  unique (product_id, size)
);

-- RLS enabled, no policies (server-side access only via service role)
alter table products enable row level security;
alter table product_variants enable row level security;

-- Auto-update updated_at on products
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();
