-- Supabase table for storing PayFast success responses
create table if not exists public.payfast_transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null check (status in ('success','failure')),
  amount numeric,
  currency text,
  basket_id text,
  token text,
  order_date text,
  merchant_id text,
  response_code text,
  response_message text,
  gateway_transaction_id text,
  raw_params jsonb
);

-- Indexes for faster lookups
create index if not exists payfast_transactions_created_at_idx on public.payfast_transactions(created_at);
create index if not exists payfast_transactions_basket_id_idx on public.payfast_transactions(basket_id);
create index if not exists payfast_transactions_gateway_txn_id_idx on public.payfast_transactions(gateway_transaction_id);

-- Example RLS policies (adjust to your needs):
-- enable row level security
alter table public.payfast_transactions enable row level security;

-- allow only service role to insert (recommended)
-- Note: This policy assumes requests from anon role are blocked; use service role key on server.
create policy if not exists payfast_transactions_insert_service_role
  on public.payfast_transactions
  for insert
  to service_role
  using (true)
  with check (true);

-- allow select to authenticated users if needed (comment out if not required)
-- create policy if not exists payfast_transactions_select_authenticated
--   on public.payfast_transactions
--   for select
--   to authenticated
--   using (true);