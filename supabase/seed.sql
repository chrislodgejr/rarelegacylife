insert into public.system_settings (key, value, description)
values
  (
    'lead_assignment',
    '{"mode":"round_robin","fallback":"unassigned_admin_alert"}'::jsonb,
    'MVP lead assignment settings.'
  ),
  (
    'sla_defaults',
    '{"hot_lead_minutes":15,"warm_lead_minutes":60,"stale_lead_hours":24}'::jsonb,
    'Initial speed-to-lead thresholds for future automation.'
  )
on conflict (key) do update
set value = excluded.value,
    description = excluded.description,
    updated_at = now();

insert into public.chat_threads (name, thread_type, visibility, active, metadata)
values (
  'Rare Legacy Life Internal',
  'internal',
  'company',
  true,
  '{"purpose":"company_internal_chat"}'::jsonb
)
on conflict do nothing;

-- First admin bootstrap:
-- 1. Sign up normally through /login.
-- 2. Replace the email below and run this once in Supabase SQL editor.
--
-- update public.profiles
-- set role = 'admin',
--     status = 'active',
--     approved_at = now()
-- where email = 'founder@example.com';
