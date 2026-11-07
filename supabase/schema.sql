-- SMART BAZAR database starter. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(), name text not null,
 category text not null default 'অন্যান্য', description text not null default '',
 price numeric(12,2) not null check (price >= 0), image_url text,
 stock integer not null default 0 check (stock >= 0), active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), customer_name text not null,
 phone text not null, address text not null,
 payment_method text not null check (payment_method in ('cod','bkash','nagad')),
 payment_reference text, status text not null default 'pending'
 check (status in ('pending','confirmed','cancelled','shipped','delivered')),
 subtotal numeric(12,2) not null check (subtotal >= 0), created_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null, product_name text not null,
 unit_price numeric(12,2) not null check (unit_price >= 0), quantity integer not null check (quantity > 0)
);
create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now()
);
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;
create policy "Public can view active products" on public.products for select using (active = true);
create policy "Admins manage products" on public.products for all to authenticated
 using (exists(select 1 from public.admin_users a where a.user_id=auth.uid()))
 with check (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins view orders" on public.orders for select to authenticated
 using (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins update orders" on public.orders for update to authenticated
 using (exists(select 1 from public.admin_users a where a.user_id=auth.uid()))
 with check (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins view order items" on public.order_items for select to authenticated
 using (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
-- Order creation must use a server-side Edge Function that validates current prices and stock.
-- Do not expose public INSERT policies or trust browser-supplied prices.
-- Add the admin user after creating an Auth user:
-- insert into public.admin_users(user_id) values ('AUTH_USER_UUID');
