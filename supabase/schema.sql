-- WeShare Database Schema
-- Run in Supabase SQL editor

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- ─── USERS & AUTH ────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'buyer' check (role in ('buyer','shop','rider','admin')),
  location_lat double precision,
  location_lng double precision,
  location_label text,
  onesignal_player_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── SHOPS ───────────────────────────────────────────────────────────────────

create table public.shops (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  categories text[] default '{}',
  address text,
  lat double precision,
  lng double precision,
  rating_avg numeric(3,2) default 0,
  rating_count int default 0,
  verified boolean default false,
  active boolean default true,
  stripe_account_id text,
  wholesale_price_verified boolean default false,
  shop_ref text unique, -- e.g. WS-SHOP-014
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── ITEMS ───────────────────────────────────────────────────────────────────

create table public.items (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid references public.shops(id) on delete cascade not null,
  name text not null,
  description text,
  category text not null check (category in ('meat_poultry','drinks','pantry','produce','frozen','horeca','other')),
  image_urls text[] default '{}',
  wholesale_price_gbp int not null, -- in pence
  retail_price_gbp int, -- in pence, for comparison
  case_weight_g int, -- total case weight in grams
  split_options int[] default '{2,4}', -- allowed split counts
  default_split int not null default 4,
  min_fill_portions int default 1, -- minimum portions to trigger shipping
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── POOLS ───────────────────────────────────────────────────────────────────

create table public.pools (
  id uuid primary key default uuid_generate_v4(),
  pool_ref text unique not null, -- e.g. WS-3914
  item_id uuid references public.items(id) on delete restrict not null,
  shop_id uuid references public.shops(id) on delete restrict not null,
  total_portions int not null,
  filled_portions int default 0,
  price_per_portion_gbp int not null, -- in pence
  status text not null default 'open' check (status in ('open','filled','packing','shipped','delivered','cancelled','refunded')),
  expires_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  rider_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── POOL MEMBERS ────────────────────────────────────────────────────────────

create table public.pool_members (
  id uuid primary key default uuid_generate_v4(),
  pool_id uuid references public.pools(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete restrict not null,
  portions int not null default 1,
  price_paid_gbp int not null, -- total in pence
  delivery_address text not null,
  delivery_lat double precision,
  delivery_lng double precision,
  stripe_payment_intent_id text,
  payment_status text default 'pending' check (payment_status in ('pending','held','captured','refunded','failed')),
  verification_code text,
  delivered_at timestamptz,
  created_at timestamptz default now(),
  unique(pool_id, buyer_id)
);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────

create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_ref text unique not null,
  pool_id uuid references public.pools(id) on delete restrict not null,
  buyer_id uuid references public.profiles(id) on delete restrict not null,
  pool_member_id uuid references public.pool_members(id) on delete restrict not null,
  subtotal_gbp int not null,
  delivery_fee_gbp int not null default 0,
  service_fee_gbp int not null default 0,
  total_gbp int not null,
  status text default 'pending' check (status in ('pending','confirmed','packing','in_transit','delivered','cancelled','refunded')),
  stripe_payment_intent_id text,
  receipt_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── DELIVERY STOPS ──────────────────────────────────────────────────────────

create table public.delivery_stops (
  id uuid primary key default uuid_generate_v4(),
  pool_id uuid references public.pools(id) on delete cascade not null,
  pool_member_id uuid references public.pool_members(id) on delete cascade not null,
  stop_order int not null,
  status text default 'pending' check (status in ('pending','active','completed')),
  arrived_at timestamptz,
  delivered_at timestamptz,
  photo_url text
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid references public.profiles(id) on delete restrict not null,
  pool_id uuid references public.pools(id) on delete restrict not null,
  shop_rating int check (shop_rating between 1 and 5),
  rider_rating int check (rider_rating between 1 and 5),
  note text,
  created_at timestamptz default now()
);

-- ─── POOL INVITES ─────────────────────────────────────────────────────────────

create table public.pool_invites (
  id uuid primary key default uuid_generate_v4(),
  pool_id uuid references public.pools(id) on delete cascade not null,
  inviter_id uuid references public.profiles(id) on delete cascade not null,
  invitee_phone text,
  invitee_email text,
  token text unique not null default encode(gen_random_bytes(12), 'hex'),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- ─── WALLET ──────────────────────────────────────────────────────────────────

create table public.wallets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  balance_gbp int not null default 0, -- in pence
  pending_gbp int not null default 0,
  updated_at timestamptz default now()
);

create table public.wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  wallet_id uuid references public.wallets(id) on delete cascade not null,
  type text not null check (type in ('topup','hold','capture','refund','payout')),
  amount_gbp int not null, -- in pence, positive = credit, negative = debit
  reference text,
  description text,
  created_at timestamptz default now()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  body text,
  data jsonb,
  read boolean default false,
  created_at timestamptz default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

create index on public.pools(status, shop_id);
create index on public.pools(item_id);
create index on public.pool_members(pool_id);
create index on public.pool_members(buyer_id);
create index on public.orders(buyer_id);
create index on public.notifications(user_id, read);
create index on public.shops(verified, active);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.items enable row level security;
alter table public.pools enable row level security;
alter table public.pool_members enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.pool_invites enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.notifications enable row level security;

-- Profiles: users see their own, admins see all
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Shops: public read, owners manage
create policy "Shops are publicly viewable" on public.shops for select using (active = true);
create policy "Shop owners manage their shops" on public.shops for all using (auth.uid() = owner_id);

-- Items: public read for active items
create policy "Items are publicly viewable" on public.items for select using (active = true);
create policy "Shop owners manage items" on public.items for all
  using (exists (select 1 from public.shops where id = shop_id and owner_id = auth.uid()));

-- Pools: public read for open pools
create policy "Open pools are publicly viewable" on public.pools for select using (status = 'open' or status = 'filled');
create policy "Shop owners manage their pools" on public.pools for all
  using (exists (select 1 from public.shops where id = shop_id and owner_id = auth.uid()));

-- Pool members: buyers see their own memberships
create policy "Buyers see own pool memberships" on public.pool_members for select using (auth.uid() = buyer_id);
create policy "Buyers join pools" on public.pool_members for insert with check (auth.uid() = buyer_id);

-- Orders: buyers see own orders
create policy "Buyers see own orders" on public.orders for select using (auth.uid() = buyer_id);

-- Notifications: users see own
create policy "Users see own notifications" on public.notifications for all using (auth.uid() = user_id);

-- Wallets: users see own
create policy "Users see own wallet" on public.wallets for select using (auth.uid() = user_id);
create policy "Users see own transactions" on public.wallet_transactions for select
  using (exists (select 1 from public.wallets where id = wallet_id and user_id = auth.uid()));

-- ─── FUNCTIONS ───────────────────────────────────────────────────────────────

-- Auto-generate pool_ref
create sequence if not exists pool_ref_seq start 1000;

create or replace function generate_pool_ref() returns text as $$
  select 'WS-' || lpad(nextval('pool_ref_seq')::text, 4, '0');
$$ language sql;

-- Auto-fill pool_ref on insert
create or replace function set_pool_ref() returns trigger as $$
begin
  if new.pool_ref is null then
    new.pool_ref := 'WS-' || lpad(nextval('pool_ref_seq')::text, 4, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger pools_set_ref before insert on public.pools
  for each row execute function set_pool_ref();

-- Update pool filled count
create or replace function update_pool_filled() returns trigger as $$
begin
  update public.pools
    set filled_portions = (select coalesce(sum(portions), 0) from public.pool_members where pool_id = new.pool_id)
  where id = new.pool_id;
  return new;
end;
$$ language plpgsql;

create trigger pool_members_update_filled after insert or update or delete on public.pool_members
  for each row execute function update_pool_filled();

-- Auto-create wallet on user creation
create or replace function create_user_wallet() returns trigger as $$
begin
  insert into public.wallets(user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql;

create trigger profiles_create_wallet after insert on public.profiles
  for each row execute function create_user_wallet();

-- Updated_at trigger
create or replace function update_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles for each row execute function update_updated_at();
create trigger shops_updated_at before update on public.shops for each row execute function update_updated_at();
create trigger items_updated_at before update on public.items for each row execute function update_updated_at();
create trigger pools_updated_at before update on public.pools for each row execute function update_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function update_updated_at();
