-- Triggers for FINAL payments schema to credit views on approval
create extension if not exists pgcrypto;

-- Function: when a payment is accepted, add its views_limit to user_subscriptions
create or replace function public.handle_payment_acceptance_final()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    if new.payment_status = 'accepted' then
      -- Upsert into user_subscriptions adding views
      insert into public.user_subscriptions (
        user_id,
        views_limit,
        payment_status,
        subscription_status,
        created_at,
        updated_at
      ) values (
        new.user_id,
        new.views_limit,
        'approved',
        case lower(new.package_type)
          when 'premium' then 'Premium Package'
          when 'standard' then 'Standard Package'
          when 'basic' then 'Basic Package'
          else 'Basic Package'
        end,
        now(),
        now()
      )
      on conflict (user_id)
      do update set
        views_limit = public.user_subscriptions.views_limit + excluded.views_limit,
        payment_status = 'approved',
        subscription_status = excluded.subscription_status,
        updated_at = now();
    end if;
  elsif (TG_OP = 'UPDATE') then
    if new.payment_status = 'accepted' and (old.payment_status is distinct from new.payment_status) then
      update public.user_subscriptions
        set views_limit = coalesce(views_limit,0) + coalesce(new.views_limit,0),
            payment_status = 'approved',
            subscription_status = case lower(new.package_type)
              when 'premium' then 'Premium Package'
              when 'standard' then 'Standard Package'
              when 'basic' then 'Basic Package'
              else 'Basic Package'
            end,
            updated_at = now()
      where user_id = new.user_id;
      -- If row not exists, insert it
      insert into public.user_subscriptions (
        user_id,
        views_limit,
        payment_status,
        subscription_status,
        created_at,
        updated_at
      )
      select new.user_id, coalesce(new.views_limit,0), 'approved',
        case lower(new.package_type)
          when 'premium' then 'Premium Package'
          when 'standard' then 'Standard Package'
          when 'basic' then 'Basic Package'
          else 'Basic Package'
        end,
        now(), now()
      where not exists (
        select 1 from public.user_subscriptions us where us.user_id = new.user_id
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Triggers after insert/update on payments
create trigger payments_final_acceptance_ins_trg
after insert on public.payments
for each row execute procedure public.handle_payment_acceptance_final();

create trigger payments_final_acceptance_upd_trg
after update on public.payments
for each row execute procedure public.handle_payment_acceptance_final();