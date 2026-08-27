create table public.retirement_blueprint_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  zip_code text not null,
  meeting_style text not null,
  best_time_to_contact text not null,
  question text,
  status text not null default 'new',
  assigned_agent_id uuid references public.agents(id) on delete set null,
  source text not null default 'retirement_blueprint_qr',
  consent_tcpa boolean not null,
  consent_text text not null,
  consent_version text not null,
  consent_timestamp timestamptz not null default now(),
  consent_ip inet,
  consent_user_agent text,
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  msclkid text,
  qr_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint retirement_blueprint_name_length check (
    char_length(first_name) between 1 and 80
    and char_length(last_name) between 1 and 80
  ),
  constraint retirement_blueprint_email_length check (char_length(email) between 3 and 320),
  constraint retirement_blueprint_phone_length check (char_length(phone) between 7 and 32),
  constraint retirement_blueprint_zip_format check (zip_code ~ '^\d{5}(-\d{4})?$'),
  constraint retirement_blueprint_meeting_style check (
    meeting_style in ('virtual', 'home', 'office', 'phone')
  ),
  constraint retirement_blueprint_status check (
    status in ('new', 'contacted', 'scheduled', 'completed', 'closed', 'spam')
  ),
  constraint retirement_blueprint_consent_required check (consent_tcpa),
  constraint retirement_blueprint_best_time_length check (
    char_length(best_time_to_contact) between 2 and 160
  ),
  constraint retirement_blueprint_question_length check (
    question is null or char_length(question) <= 2500
  )
);

create index retirement_blueprint_requests_created_at_idx
  on public.retirement_blueprint_requests (created_at desc);
create index retirement_blueprint_requests_status_idx
  on public.retirement_blueprint_requests (status, created_at desc);
create index retirement_blueprint_requests_assigned_agent_idx
  on public.retirement_blueprint_requests (assigned_agent_id)
  where assigned_agent_id is not null;
create index retirement_blueprint_requests_email_created_idx
  on public.retirement_blueprint_requests (lower(email), created_at desc);

create trigger set_retirement_blueprint_requests_updated_at
before update on public.retirement_blueprint_requests
for each row execute function public.set_updated_at();

alter table public.retirement_blueprint_requests enable row level security;
revoke all on table public.retirement_blueprint_requests from anon, authenticated;
grant select, insert, update, delete on table public.retirement_blueprint_requests to service_role;

comment on table public.retirement_blueprint_requests is
  'Server-only intake records for the complimentary Retirement Income Blueprint landing page.';

create table public.retirement_landing_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.retirement_blueprint_requests(id) on delete set null,
  event_name text not null,
  session_id text not null,
  meeting_style text,
  page_url text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  qr_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint retirement_landing_event_name check (
    event_name in (
      'qr_landing_visit',
      'meeting_option_click',
      'form_start',
      'form_submission',
      'form_submission_success',
      'form_validation_error',
      'form_submission_error',
      'successful_appointment'
    )
  ),
  constraint retirement_landing_event_session_length check (
    char_length(session_id) between 8 and 160
  ),
  constraint retirement_landing_event_meeting_style check (
    meeting_style is null or meeting_style in ('virtual', 'home', 'office', 'phone')
  )
);

create index retirement_landing_events_created_at_idx
  on public.retirement_landing_events (created_at desc);
create index retirement_landing_events_name_created_idx
  on public.retirement_landing_events (event_name, created_at desc);
create index retirement_landing_events_request_idx
  on public.retirement_landing_events (request_id)
  where request_id is not null;

alter table public.retirement_landing_events enable row level security;
revoke all on table public.retirement_landing_events from anon, authenticated;
grant select, insert, update, delete on table public.retirement_landing_events to service_role;

comment on table public.retirement_landing_events is
  'Privacy-conscious, server-recorded conversion events for the Retirement Income Blueprint funnel.';
