-- Reset profile views when a payment is accepted
-- Run this in Supabase SQL editor to enforce DB-level consistency

create or replace function public.reset_profile_views_on_payment()
returns trigger as $$
begin
  -- Only act when status is accepted
  if (tg_op = 'INSERT' or tg_op = 'UPDATE') and new.payment_status = 'accepted' then
    -- Wipe viewer history for this user so new package starts fresh
    delete from public.profile_views
    where viewer_user_id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Attach triggers to payments table
drop trigger if exists payments_reset_profile_views_ins_trg on public.payments;
create trigger payments_reset_profile_views_ins_trg
after insert on public.payments
for each row execute procedure public.reset_profile_views_on_payment();

drop trigger if exists payments_reset_profile_views_upd_trg on public.payments;
create trigger payments_reset_profile_views_upd_trg
after update on public.payments
for each row execute procedure public.reset_profile_views_on_payment();