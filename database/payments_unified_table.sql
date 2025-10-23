-- Unified payments schema supporting PayFast and manual screenshot uploads
-- Includes auto-accept logic for PayFast and view-limit updates

-- Ensure required extensions
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- Payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  views_limit integer not null default 0,
  ss_url text null, -- screenshot URL for manual payment proofs
  rejection_reason text null,
  payment_status text not null default 'pending', -- pending | under_review | accepted | rejected
  package_type text not null default 'basic', -- basic | standard | premium
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz null,
  reviewed_by uuid null,
  amount numeric(10,2) null,
  currency varchar(3) null default 'PKR',
  payment_method text null, -- payfast | bank_transfer | jazzcash | easypaisa | other
  notes text null,
  -- Optional gateway fields (useful for PayFast auditing)
  gateway_transaction_id text null,
  gateway_reference text null,
  gateway_params jsonb null,

  constraint payments_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint payments_reviewed_by_fkey foreign key (reviewed_by) references auth.users (id),
  constraint payments_status_check check (
    payment_status = any (array['pending','under_review','accepted','rejected'])
  ),
  constraint payments_package_type_check check (
    package_type = any (array['basic','standard','premium'])
  )
);

-- Indexes
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(payment_status);
create index if not exists idx_payments_created_at on public.payments(created_at);
create index if not exists idx_payments_method on public.payments(payment_method);

-- Row Level Security
alter table public.payments enable row level security;

-- Allow authenticated users to insert/select their own payments
create policy if not exists payments_select_own
  on public.payments for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists payments_insert_authenticated
  on public.payments for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow service role full access (server-side APIs)
create policy if not exists payments_all_service_role
  on public.payments for all
  to service_role
  using (true)
  with check (true);

-- Timestamp trigger: keep updated_at fresh
create or replace function public.payments_set_timestamps()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    new.created_at := coalesce(new.created_at, now());
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql security definer;

create trigger payments_set_timestamps_trg
before insert or update on public.payments
for each row execute procedure public.payments_set_timestamps();

-- Auto-accept PayFast payments: no screenshot required, views are credited directly
create or replace function public.payments_auto_accept_payfast()
returns trigger as $$
begin
  if lower(coalesce(new.payment_method,'other')) = 'payfast' then
    new.payment_status := 'accepted';
    new.notes := coalesce(new.notes, 'Auto-accepted via PayFast');
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger payments_auto_accept_payfast_trg
before insert on public.payments
for each row execute procedure public.payments_auto_accept_payfast();

-- Handle accepted payments: transfer views to user_subscriptions
create or replace function public.handle_payment_acceptance()
returns trigger as $$
begin
  if new.payment_status = 'accepted' then
    -- Update existing subscription
    update public.user_subscriptions us
      set views_limit   = coalesce(us.views_limit, 0) + coalesce(new.views_limit, 0),
          payment_status = 'approved',
          updated_at     = now()
      where us.user_id = new.user_id;

    -- Insert subscription if not exists
    insert into public.user_subscriptions (
      user_id, views_limit, payment_status, subscription_status, created_at, updated_at
    )
    select
      new.user_id,
      coalesce(new.views_limit, 0),
      'approved',
      case lower(new.package_type)
        when 'premium'  then 'Premium Package'
        when 'standard' then 'Standard Package'
        else 'Basic Package'
      end,
      now(), now()
    where not exists (
      select 1 from public.user_subscriptions us where us.user_id = new.user_id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger payments_handle_acceptance_trg
after insert or update on public.payments
for each row execute procedure public.handle_payment_acceptance();