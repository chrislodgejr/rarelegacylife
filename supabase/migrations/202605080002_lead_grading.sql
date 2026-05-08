do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_grade') then
    create type public.lead_grade as enum ('A+', 'A', 'B', 'C', 'D', 'F');
  end if;
end
$$;

alter table public.leads
  add column if not exists lead_grade public.lead_grade not null default 'F',
  add column if not exists lead_score_breakdown jsonb not null default '{}'::jsonb,
  add column if not exists quote_email_otp_verified boolean not null default false,
  add column if not exists quote_email_otp_verified_at timestamptz,
  add column if not exists quote_auth_user_id uuid references auth.users(id) on delete set null;

create index if not exists leads_lead_grade_idx on public.leads(lead_grade);
create index if not exists leads_temperature_score_idx on public.leads(lead_temperature, lead_score desc);
create index if not exists leads_next_follow_up_at_idx on public.leads(next_follow_up_at);
create index if not exists leads_last_activity_at_idx on public.leads(last_activity_at desc);
create index if not exists leads_quote_auth_user_id_idx on public.leads(quote_auth_user_id);
