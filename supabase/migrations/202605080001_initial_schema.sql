create extension if not exists pgcrypto;

create type public.app_role as enum (
  'pending',
  'admin',
  'manager',
  'agent',
  'client',
  'support'
);

create type public.profile_status as enum ('pending', 'active', 'inactive');
create type public.lead_status as enum (
  'new',
  'assigned',
  'contacted',
  'scheduled',
  'quoted',
  'application_started',
  'application_submitted',
  'underwriting',
  'approved',
  'placed',
  'lost',
  'not_qualified',
  'do_not_contact'
);
create type public.coverage_purpose as enum (
  'family_protection',
  'mortgage_protection',
  'final_expenses',
  'business_protection',
  'wealth_transfer',
  'not_sure_yet'
);
create type public.health_rating as enum ('excellent', 'good', 'fair', 'poor');
create type public.contact_method as enum ('phone', 'sms', 'email');
create type public.sla_status as enum ('on_track', 'at_risk', 'breached');
create type public.lead_temperature as enum ('hot', 'warm', 'cold');
create type public.task_type as enum (
  'call',
  'text',
  'email',
  'appointment',
  'document_request',
  'application_follow_up',
  'underwriting_follow_up',
  'policy_delivery',
  'general_follow_up'
);
create type public.task_status as enum (
  'open',
  'in_progress',
  'completed',
  'cancelled',
  'overdue'
);
create type public.task_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.communication_direction as enum ('inbound', 'outbound', 'internal');
create type public.communication_channel as enum ('email', 'sms', 'call', 'chat', 'system');
create type public.communication_status as enum (
  'queued',
  'sent',
  'delivered',
  'failed',
  'received'
);
create type public.policy_status as enum (
  'application',
  'underwriting',
  'approved',
  'placed',
  'declined',
  'lapsed',
  'cancelled'
);
create type public.commission_type as enum ('advance', 'trail', 'renewal', 'bonus');
create type public.commission_status as enum ('pending', 'approved', 'paid', 'chargeback');
create type public.agent_application_status as enum (
  'new',
  'reviewing',
  'approved',
  'rejected',
  'archived'
);
create type public.contact_message_status as enum ('new', 'reviewed', 'closed', 'spam');
create type public.appointment_status as enum (
  'scheduled',
  'completed',
  'cancelled',
  'no_show',
  'rescheduled'
);
create type public.webhook_status as enum ('received', 'processed', 'failed', 'ignored');
create type public.license_status as enum ('active', 'pending', 'expired', 'inactive');
create type public.consent_type as enum (
  'tcpa',
  'privacy',
  'sms',
  'email_marketing'
);
create type public.chat_thread_type as enum ('lead', 'internal');
create type public.chat_visibility as enum ('lead', 'team', 'company', 'direct');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'pending',
  phone text,
  state text,
  status public.profile_status not null default 'pending',
  avatar_url text,
  last_login_at timestamptz,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_state_format check (state is null or state ~ '^[A-Z]{2}$')
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  manager_id uuid references public.profiles(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  state text,
  active boolean not null default true,
  accepts_new_leads boolean not null default true,
  max_active_leads integer not null default 50,
  current_active_leads integer not null default 0,
  team_id uuid references public.teams(id) on delete set null,
  last_assigned_at timestamptz,
  lead_weight integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agents_state_format check (state is null or state ~ '^[A-Z]{2}$'),
  constraint agents_max_active_leads_positive check (max_active_leads >= 0),
  constraint agents_current_active_leads_positive check (current_active_leads >= 0),
  constraint agents_lead_weight_positive check (lead_weight > 0)
);

create table public.agent_licenses (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  state text not null,
  license_number text,
  license_status public.license_status not null default 'active',
  expiration_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_licenses_state_format check (state ~ '^[A-Z]{2}$'),
  constraint agent_licenses_unique_state unique (agent_id, state)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  date_of_birth date not null,
  state text not null,
  zip_code text not null,
  marital_status text,
  dependents integer not null default 0,
  desired_coverage_amount numeric(12, 2),
  coverage_purpose public.coverage_purpose not null,
  tobacco_use boolean not null default false,
  health_rating public.health_rating not null,
  medical_conditions text,
  current_coverage text,
  preferred_contact_method public.contact_method not null,
  best_time_to_contact text,
  source text not null default 'website_quote_form',
  status public.lead_status not null default 'new',
  lead_score integer not null default 0,
  lead_temperature public.lead_temperature not null default 'cold',
  assigned_agent_id uuid references public.agents(id) on delete set null,
  assigned_at timestamptz,
  first_contacted_at timestamptz,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  last_activity_at timestamptz not null default now(),
  stale_at timestamptz,
  sla_status public.sla_status not null default 'on_track',
  consent_tcpa boolean not null default false,
  consent_privacy boolean not null default false,
  consent_sms boolean not null default false,
  consent_email_marketing boolean not null default false,
  consent_timestamp timestamptz,
  consent_ip inet,
  consent_user_agent text,
  consent_source_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  referrer text,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_state_format check (state ~ '^[A-Z]{2}$'),
  constraint leads_dependents_positive check (dependents >= 0),
  constraint leads_score_range check (lead_score between 0 and 100),
  constraint leads_required_consent check (consent_tcpa and consent_privacy),
  constraint leads_assignment_status_consistency check (
    (assigned_agent_id is null and assigned_at is null)
    or (assigned_agent_id is not null and assigned_at is not null)
  )
);

create table public.lead_assignments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  assigned_by_user_id uuid references public.profiles(id) on delete set null,
  assignment_reason text,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz,
  active boolean not null default true
);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create table public.lead_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  assigned_user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  due_date timestamptz,
  priority public.task_priority not null default 'medium',
  task_type public.task_type not null default 'general_follow_up',
  status public.task_status not null default 'open',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  activity_type text not null,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  consent_type public.consent_type not null,
  consent_given boolean not null default false,
  consent_text text not null,
  consent_timestamp timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  source_url text,
  created_at timestamptz not null default now()
);

create table public.communications (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  direction public.communication_direction not null,
  channel public.communication_channel not null,
  provider text,
  provider_message_id text,
  subject text,
  body text,
  status public.communication_status not null default 'queued',
  sent_at timestamptz,
  delivered_at timestamptz,
  failed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  name text,
  thread_type public.chat_thread_type not null default 'lead',
  visibility public.chat_visibility not null default 'lead',
  created_by uuid references public.profiles(id) on delete set null,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_threads_lead_required check (
    (thread_type = 'lead' and lead_id is not null)
    or (thread_type = 'internal')
  )
);

create table public.chat_participants (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  participant_role text not null default 'member',
  last_read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint chat_participants_unique unique (thread_id, profile_id)
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_profile_id uuid references public.profiles(id) on delete set null,
  body text not null,
  channel public.communication_channel not null default 'chat',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create table public.crm_notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  lead_id uuid references public.leads(id) on delete cascade,
  title text not null,
  body text,
  notification_type text not null default 'system',
  priority public.task_priority not null default 'medium',
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.policies (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  client_id uuid references public.profiles(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  carrier text,
  product_type text,
  policy_number text,
  face_amount numeric(12, 2),
  premium numeric(12, 2),
  payment_frequency text,
  policy_status public.policy_status not null default 'application',
  effective_date date,
  issued_date date,
  placed_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  commission_type public.commission_type not null,
  amount numeric(12, 2) not null,
  status public.commission_status not null default 'pending',
  paid_date date,
  created_at timestamptz not null default now()
);

create table public.agent_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  state text not null,
  licensed boolean not null default false,
  license_number text,
  years_experience integer,
  current_agency text,
  interest_reason text not null,
  status public.agent_application_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_applications_state_format check (state ~ '^[A-Z]{2}$'),
  constraint agent_applications_years_positive check (years_experience is null or years_experience >= 0)
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  inquiry_type text not null,
  message text not null,
  status public.contact_message_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  appointment_type text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  location text,
  meeting_url text,
  calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_time_order check (end_time > start_time)
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.webhook_status not null default 'received',
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index profiles_auth_user_id_idx on public.profiles(auth_user_id);
create index profiles_email_idx on public.profiles(lower(email));
create index profiles_role_idx on public.profiles(role);
create index profiles_status_idx on public.profiles(status);
create index agents_profile_id_idx on public.agents(profile_id);
create index agents_team_id_idx on public.agents(team_id);
create index agents_active_accepts_idx on public.agents(active, accepts_new_leads);
create index agent_licenses_agent_id_idx on public.agent_licenses(agent_id);
create index agent_licenses_state_idx on public.agent_licenses(state);
create index leads_created_at_idx on public.leads(created_at desc);
create index leads_status_idx on public.leads(status);
create index leads_assigned_agent_id_idx on public.leads(assigned_agent_id);
create index leads_state_idx on public.leads(state);
create index leads_source_idx on public.leads(source);
create index leads_lead_score_idx on public.leads(lead_score desc);
create index leads_email_idx on public.leads(lower(email));
create index leads_phone_idx on public.leads(phone);
create index lead_tasks_due_date_idx on public.lead_tasks(due_date);
create index lead_tasks_status_idx on public.lead_tasks(status);
create index lead_tasks_assigned_user_id_idx on public.lead_tasks(assigned_user_id);
create index lead_notes_lead_id_idx on public.lead_notes(lead_id);
create index lead_activity_lead_id_idx on public.lead_activity(lead_id);
create index lead_activity_created_at_idx on public.lead_activity(created_at desc);
create index communications_lead_id_idx on public.communications(lead_id);
create index chat_threads_lead_id_idx on public.chat_threads(lead_id);
create index chat_threads_thread_type_idx on public.chat_threads(thread_type);
create index chat_participants_thread_id_idx on public.chat_participants(thread_id);
create index chat_participants_profile_id_idx on public.chat_participants(profile_id);
create index chat_messages_thread_id_created_at_idx on public.chat_messages(thread_id, created_at desc);
create index crm_notifications_profile_read_idx on public.crm_notifications(profile_id, read_at, created_at desc);
create index crm_notifications_lead_id_idx on public.crm_notifications(lead_id);
create index audit_logs_user_id_idx on public.audit_logs(user_id);
create index audit_logs_entity_type_idx on public.audit_logs(entity_type);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index lead_assignments_lead_id_idx on public.lead_assignments(lead_id);
create index lead_assignments_agent_id_idx on public.lead_assignments(agent_id);
create index consent_records_lead_id_idx on public.consent_records(lead_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_teams_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

create trigger set_agents_updated_at
before update on public.agents
for each row execute function public.set_updated_at();

create trigger set_agent_licenses_updated_at
before update on public.agent_licenses
for each row execute function public.set_updated_at();

create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger set_lead_tasks_updated_at
before update on public.lead_tasks
for each row execute function public.set_updated_at();

create trigger set_chat_threads_updated_at
before update on public.chat_threads
for each row execute function public.set_updated_at();

create trigger set_policies_updated_at
before update on public.policies
for each row execute function public.set_updated_at();

create trigger set_agent_applications_updated_at
before update on public.agent_applications
for each row execute function public.set_updated_at();

create trigger set_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    auth_user_id,
    email,
    full_name,
    avatar_url,
    role,
    status
  )
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    'pending',
    'pending'
  )
  on conflict (auth_user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.profiles p
  where p.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.auth_user_id = auth.uid()
    and p.status = 'active'
  limit 1
$$;

create or replace function public.has_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = any(required_roles), false)
$$;

create or replace function public.current_agent_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select a.id
  from public.agents a
  join public.profiles p on p.id = a.profile_id
  where p.auth_user_id = auth.uid()
    and p.status = 'active'
    and p.role = 'agent'
    and a.active
  limit 1
$$;

create or replace function public.can_access_lead_id(target_lead_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.leads l
    where l.id = target_lead_id
      and (
        public.has_role(array['admin']::public.app_role[])
        or (
          public.has_role(array['manager']::public.app_role[])
          and exists (
            select 1
            from public.agents a
            join public.teams t on t.id = a.team_id
            where a.id = l.assigned_agent_id
              and t.manager_id = public.current_profile_id()
              and t.active
          )
        )
        or (
          public.has_role(array['agent']::public.app_role[])
          and l.assigned_agent_id = public.current_agent_id()
        )
      )
  )
$$;

create or replace function public.can_access_chat_thread(target_thread_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_threads t
    where t.id = target_thread_id
      and t.active
      and (
        public.has_role(array['admin']::public.app_role[])
        or exists (
          select 1
          from public.chat_participants cp
          where cp.thread_id = t.id
            and cp.profile_id = public.current_profile_id()
        )
        or (
          t.thread_type = 'internal'
          and t.visibility = 'company'
          and public.has_role(array['admin', 'manager', 'agent', 'support']::public.app_role[])
        )
        or (
          t.lead_id is not null
          and public.can_access_lead_id(t.lead_id)
        )
      )
  )
$$;

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.agents enable row level security;
alter table public.agent_licenses enable row level security;
alter table public.leads enable row level security;
alter table public.lead_assignments enable row level security;
alter table public.lead_notes enable row level security;
alter table public.lead_tasks enable row level security;
alter table public.lead_activity enable row level security;
alter table public.audit_logs enable row level security;
alter table public.consent_records enable row level security;
alter table public.communications enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_participants enable row level security;
alter table public.chat_messages enable row level security;
alter table public.crm_notifications enable row level security;
alter table public.policies enable row level security;
alter table public.commissions enable row level security;
alter table public.agent_applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.appointments enable row level security;
alter table public.webhook_events enable row level security;
alter table public.system_settings enable row level security;

create policy "Profiles can read their own profile"
on public.profiles for select
to authenticated
using (auth_user_id = auth.uid());

create policy "Admins can manage all profiles"
on public.profiles for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Users can update their own basic profile"
on public.profiles for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

create policy "Admins and managers can read teams"
on public.teams for select
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or manager_id = public.current_profile_id()
);

create policy "Admins can manage teams"
on public.teams for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Admins and managers can read agents"
on public.agents for select
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or exists (
    select 1
    from public.teams t
    where t.id = agents.team_id
      and t.manager_id = public.current_profile_id()
  )
  or profile_id = public.current_profile_id()
);

create policy "Admins can manage agents"
on public.agents for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Admins and managers can read licenses"
on public.agent_licenses for select
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or exists (
    select 1
    from public.agents a
    join public.teams t on t.id = a.team_id
    where a.id = agent_licenses.agent_id
      and t.manager_id = public.current_profile_id()
  )
  or agent_id = public.current_agent_id()
);

create policy "Admins can manage licenses"
on public.agent_licenses for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Public can insert quote leads"
on public.leads for insert
to anon, authenticated
with check (
  source = 'website_quote_form'
  and status = 'new'
  and assigned_agent_id is null
  and assigned_at is null
  and consent_tcpa
  and consent_privacy
);

create policy "CRM users can read accessible leads"
on public.leads for select
to authenticated
using (public.can_access_lead_id(id));

create policy "Admins and managers can manage accessible leads"
on public.leads for all
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or (
    public.has_role(array['manager']::public.app_role[])
    and public.can_access_lead_id(id)
  )
)
with check (
  public.has_role(array['admin']::public.app_role[])
  or (
    public.has_role(array['manager']::public.app_role[])
    and public.can_access_lead_id(id)
  )
);

create policy "Agents can update assigned lead workflow fields"
on public.leads for update
to authenticated
using (
  public.has_role(array['agent']::public.app_role[])
  and assigned_agent_id = public.current_agent_id()
)
with check (
  public.has_role(array['agent']::public.app_role[])
  and assigned_agent_id = public.current_agent_id()
);

create policy "CRM users can read accessible lead assignments"
on public.lead_assignments for select
to authenticated
using (public.can_access_lead_id(lead_id));

create policy "Admins and managers can manage lead assignments"
on public.lead_assignments for all
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or (
    public.has_role(array['manager']::public.app_role[])
    and public.can_access_lead_id(lead_id)
  )
)
with check (
  public.has_role(array['admin']::public.app_role[])
  or (
    public.has_role(array['manager']::public.app_role[])
    and public.can_access_lead_id(lead_id)
  )
);

create policy "CRM users can read accessible lead notes"
on public.lead_notes for select
to authenticated
using (public.can_access_lead_id(lead_id));

create policy "CRM users can add notes to accessible leads"
on public.lead_notes for insert
to authenticated
with check (public.can_access_lead_id(lead_id));

create policy "CRM users can read accessible lead tasks"
on public.lead_tasks for select
to authenticated
using (lead_id is not null and public.can_access_lead_id(lead_id));

create policy "CRM users can add tasks to accessible leads"
on public.lead_tasks for insert
to authenticated
with check (lead_id is not null and public.can_access_lead_id(lead_id));

create policy "Task assignees can update their tasks"
on public.lead_tasks for update
to authenticated
using (
  assigned_user_id = public.current_profile_id()
  or public.has_role(array['admin', 'manager']::public.app_role[])
)
with check (
  assigned_user_id = public.current_profile_id()
  or public.has_role(array['admin', 'manager']::public.app_role[])
);

create policy "CRM users can read accessible activity"
on public.lead_activity for select
to authenticated
using (public.can_access_lead_id(lead_id));

create policy "CRM users can add activity to accessible leads"
on public.lead_activity for insert
to authenticated
with check (public.can_access_lead_id(lead_id));

create policy "Admins can read audit logs"
on public.audit_logs for select
to authenticated
using (public.has_role(array['admin']::public.app_role[]));

create policy "CRM users can read consent for accessible leads"
on public.consent_records for select
to authenticated
using (public.can_access_lead_id(lead_id));

create policy "CRM users can read accessible communications"
on public.communications for select
to authenticated
using (
  lead_id is not null
  and public.can_access_lead_id(lead_id)
);

create policy "CRM users can add accessible communications"
on public.communications for insert
to authenticated
with check (
  lead_id is null
  or public.can_access_lead_id(lead_id)
);

create policy "CRM users can read accessible chat threads"
on public.chat_threads for select
to authenticated
using (public.can_access_chat_thread(id));

create policy "CRM users can create accessible chat threads"
on public.chat_threads for insert
to authenticated
with check (
  public.has_role(array['admin', 'manager', 'agent', 'support']::public.app_role[])
  and (
    (thread_type = 'internal' and visibility in ('company', 'team', 'direct'))
    or (lead_id is not null and public.can_access_lead_id(lead_id))
  )
);

create policy "Admins can manage chat threads"
on public.chat_threads for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "CRM users can read accessible chat participants"
on public.chat_participants for select
to authenticated
using (public.can_access_chat_thread(thread_id));

create policy "CRM users can add themselves to accessible chat threads"
on public.chat_participants for insert
to authenticated
with check (
  profile_id = public.current_profile_id()
  and public.can_access_chat_thread(thread_id)
);

create policy "Admins can manage chat participants"
on public.chat_participants for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "CRM users can read accessible chat messages"
on public.chat_messages for select
to authenticated
using (public.can_access_chat_thread(thread_id));

create policy "CRM users can send accessible chat messages"
on public.chat_messages for insert
to authenticated
with check (
  sender_profile_id = public.current_profile_id()
  and public.can_access_chat_thread(thread_id)
);

create policy "Users can read their own notifications"
on public.crm_notifications for select
to authenticated
using (
  profile_id = public.current_profile_id()
  or public.has_role(array['admin']::public.app_role[])
);

create policy "Users can mark their own notifications read"
on public.crm_notifications for update
to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

create policy "Admins can manage notifications"
on public.crm_notifications for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "CRM users can read accessible policies"
on public.policies for select
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or (
    public.has_role(array['manager']::public.app_role[])
    and lead_id is not null
    and public.can_access_lead_id(lead_id)
  )
  or (
    public.has_role(array['agent']::public.app_role[])
    and agent_id = public.current_agent_id()
  )
  or (
    public.has_role(array['client']::public.app_role[])
    and client_id = public.current_profile_id()
  )
);

create policy "Admins can manage policies"
on public.policies for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Restricted users can read commissions"
on public.commissions for select
to authenticated
using (
  public.has_role(array['admin', 'manager']::public.app_role[])
  or (
    public.has_role(array['agent']::public.app_role[])
    and agent_id = public.current_agent_id()
  )
);

create policy "Admins can manage commissions"
on public.commissions for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Public can insert agent applications"
on public.agent_applications for insert
to anon, authenticated
with check (status = 'new');

create policy "Admins can manage agent applications"
on public.agent_applications for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Public can insert contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (status = 'new');

create policy "Admins can manage contact messages"
on public.contact_messages for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "CRM users can read accessible appointments"
on public.appointments for select
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or agent_id = public.current_agent_id()
  or (
    lead_id is not null
    and public.can_access_lead_id(lead_id)
  )
);

create policy "Admins and managers can manage appointments"
on public.appointments for all
to authenticated
using (
  public.has_role(array['admin']::public.app_role[])
  or (
    public.has_role(array['manager']::public.app_role[])
    and lead_id is not null
    and public.can_access_lead_id(lead_id)
  )
)
with check (
  public.has_role(array['admin']::public.app_role[])
  or (
    public.has_role(array['manager']::public.app_role[])
    and lead_id is not null
    and public.can_access_lead_id(lead_id)
  )
);

create policy "Admins can manage webhook events"
on public.webhook_events for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

create policy "Admins can manage system settings"
on public.system_settings for all
to authenticated
using (public.has_role(array['admin']::public.app_role[]))
with check (public.has_role(array['admin']::public.app_role[]));

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant execute on function public.current_profile_id() to authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.has_role(public.app_role[]) to authenticated;
grant execute on function public.current_agent_id() to authenticated;
grant execute on function public.can_access_lead_id(uuid) to authenticated;
grant execute on function public.can_access_chat_thread(uuid) to authenticated;

grant select on
  public.profiles,
  public.teams,
  public.agents,
  public.agent_licenses,
  public.leads,
  public.lead_assignments,
  public.lead_notes,
  public.lead_tasks,
  public.lead_activity,
  public.audit_logs,
  public.consent_records,
  public.communications,
  public.chat_threads,
  public.chat_participants,
  public.chat_messages,
  public.crm_notifications,
  public.policies,
  public.commissions,
  public.agent_applications,
  public.contact_messages,
  public.appointments,
  public.webhook_events,
  public.system_settings
to authenticated;

grant insert (
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  state,
  zip_code,
  marital_status,
  dependents,
  desired_coverage_amount,
  coverage_purpose,
  tobacco_use,
  health_rating,
  medical_conditions,
  current_coverage,
  preferred_contact_method,
  best_time_to_contact,
  source,
  status,
  consent_tcpa,
  consent_privacy,
  consent_sms,
  consent_email_marketing,
  consent_timestamp,
  consent_ip,
  consent_user_agent,
  consent_source_url,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
  landing_page,
  referrer,
  ip_address,
  user_agent
) on public.leads to anon, authenticated;

grant insert (
  first_name,
  last_name,
  email,
  phone,
  state,
  licensed,
  license_number,
  years_experience,
  current_agency,
  interest_reason,
  status
) on public.agent_applications to anon, authenticated;

grant insert (
  name,
  email,
  phone,
  inquiry_type,
  message,
  status
) on public.contact_messages to anon, authenticated;

grant insert on
  public.lead_notes,
  public.lead_tasks,
  public.lead_activity,
  public.communications,
  public.chat_threads,
  public.chat_participants,
  public.chat_messages
to authenticated;

grant update (
  full_name,
  phone,
  state,
  avatar_url,
  last_login_at,
  updated_at
) on public.profiles to authenticated;

grant update (
  status,
  first_contacted_at,
  last_contacted_at,
  next_follow_up_at,
  last_activity_at,
  sla_status,
  updated_at
) on public.leads to authenticated;

grant update (
  status,
  completed_at,
  updated_at
) on public.lead_tasks to authenticated;

grant update (
  read_at
) on public.crm_notifications to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.crm_notifications;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;
