-- Keep a single quote request per verified email code, including on retries.
alter table public.leads add column if not exists quote_verification_id uuid;
create unique index if not exists leads_quote_verification_id_unique
  on public.leads (quote_verification_id) where quote_verification_id is not null;

-- Retirement inquiries are first-class CRM records. These fields are internal
-- fact-finding notes, not a carrier illustration or suitability determination.
alter table public.retirement_blueprint_requests
  add column if not exists next_follow_up_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists retirement_goal text,
  add column if not exists target_retirement_date date,
  add column if not exists income_goal_monthly numeric(14,2),
  add column if not exists available_assets_range text,
  add column if not exists existing_annuity_notes text,
  add column if not exists liquidity_needs text,
  add column if not exists risk_tolerance_notes text,
  add column if not exists beneficiary_notes text,
  add column if not exists replacement_discussion text,
  add column if not exists case_notes text;
create index if not exists retirement_blueprint_follow_up_idx
  on public.retirement_blueprint_requests (next_follow_up_at)
  where next_follow_up_at is not null;

create table if not exists public.crm_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_secret text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists crm_push_subscriptions_profile_idx on public.crm_push_subscriptions(profile_id);
alter table public.crm_push_subscriptions enable row level security;
revoke all on public.crm_push_subscriptions from anon, authenticated;
grant select, insert, update, delete on public.crm_push_subscriptions to service_role;

-- Existing leads remain intact; clear routing state while retaining assignment history.
update public.leads set assigned_agent_id = null, assigned_at = null
where assigned_agent_id is not null;
update public.lead_assignments set active = false where active = true;
update public.retirement_blueprint_requests set assigned_agent_id = null
where assigned_agent_id is not null;

-- Retain historical profile references while immediately revoking CRM access
-- for every identity outside the two approved owner accounts.
update public.profiles set status = 'inactive'
where lower(email) not in ('chris@endlessconsulting.co', 'dan@endlessconsulting.co')
  and status <> 'inactive';
update public.agents set active = false, accepts_new_leads = false
where lower(email) not in ('chris@endlessconsulting.co', 'dan@endlessconsulting.co');

create table if not exists public.retirement_case_tasks (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.retirement_blueprint_requests(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  due_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists retirement_case_tasks_request_idx on public.retirement_case_tasks(request_id, created_at desc);
alter table public.retirement_case_tasks enable row level security;
revoke all on public.retirement_case_tasks from anon, authenticated;
grant select, insert, update, delete on public.retirement_case_tasks to service_role;
