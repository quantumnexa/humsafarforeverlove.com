-- Event registrations table for Humsafar Forever Love
-- Run this in Supabase SQL editor or via migration tool

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null unique,
  full_name text not null,
  phone text not null,
  gender text not null,
  age int not null check (age >= 18 and age <= 99),
  city text not null,
  area text,
  income_pkr numeric,
  profession text not null,
  profession_other text,
  registrant_is text not null,
  marital_status text not null,
  adults int not null check (adults >= 0),
  children int not null check (children >= 0),
  adult_price numeric not null,
  child_price numeric not null,
  adults_total numeric not null,
  children_total numeric not null,
  amount_total numeric not null,
  discount_percent int,
  discount_label text,
  payment_method text,
  payment_status text, -- e.g., pending | paid | failed | refunded
  transaction_id text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_registrations_created_at_idx on public.event_registrations (created_at desc);
create index if not exists event_registrations_payment_status_idx on public.event_registrations (payment_status);
create index if not exists event_registrations_phone_idx on public.event_registrations (phone);