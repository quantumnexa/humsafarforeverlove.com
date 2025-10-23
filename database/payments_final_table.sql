-- FINAL payments schema provided by user
create extension if not exists pgcrypto;

create table if not exists public.payments (
   id uuid not null default gen_random_uuid(),
   user_id uuid not null,
   views_limit integer not null default 0,
   ss_url text null,
   rejection_reason text null,
   payment_status text not null default 'pending'::text,
   package_type text not null default 'basic'::text,
   created_at timestamp with time zone null default now(),
   updated_at timestamp with time zone null default now(),
   reviewed_at timestamp with time zone null,
   reviewed_by uuid null,
   amount numeric(10, 2) null,
   currency character varying(3) null default 'PKR'::character varying,
   payment_method text null,
   notes text null,
   gateway_transaction_id text null,
   gateway_reference text null,
   gateway_params jsonb null,
   constraint payment_reviews_pkey primary key (id),
   constraint payment_reviews_reviewed_by_fkey foreign KEY (reviewed_by) references auth.users (id),
   constraint payment_reviews_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
   constraint payment_reviews_payment_status_check check (
     (
       payment_status = any (
         array[
           'pending'::text,
           'under_review'::text,
           'accepted'::text,
           'rejected'::text
         ]
       )
     )
   )
) TABLESPACE pg_default;

-- Indexes from provided schema
create index IF not exists idx_payment_reviews_user_id on public.payments using btree (user_id) TABLESPACE pg_default;
create index IF not exists idx_payment_reviews_status on public.payments using btree (payment_status) TABLESPACE pg_default;
create index IF not exists idx_payment_reviews_created_at on public.payments using btree (created_at) TABLESPACE pg_default;

-- Additional indexes mirrored for consistency
create index IF not exists idx_payments_user_id on public.payments using btree (user_id) TABLESPACE pg_default;
create index IF not exists idx_payments_status on public.payments using btree (payment_status) TABLESPACE pg_default;
create index IF not exists idx_payments_created_at on public.payments using btree (created_at) TABLESPACE pg_default;
create index IF not exists idx_payments_method on public.payments using btree (payment_method) TABLESPACE pg_default;