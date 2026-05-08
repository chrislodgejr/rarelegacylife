# Rare Legacy Life Architecture

## 1. Project Architecture Recommendation

Rare Legacy Life should start as a Next.js application hosted on Vercel with Supabase as the system of record. The public website, quote funnel, CRM, and agent portal live in one app so the first version stays simple, but the folder structure separates public marketing pages, authenticated dashboards, server actions, business logic, and provider integrations.

Recommended stack:

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Auth: Supabase Auth with email/password and Google OAuth
- Database: Supabase Postgres with migrations, enums, indexes, triggers, and Row-Level Security
- Email: Resend through a small notification abstraction
- SMS/calling: Signalhouse later through the same communications abstraction
- Hosting: Vercel with separate local, preview, and production environment variables

Do not make the CRM dependent on Google Workspace. Use Google for sign-in and internal business workflow, then consider Workspace-only admin restrictions later.

## 2. Database Schema And Migration Plan

The initial migration creates the business core:

- `profiles`, `agents`, `teams`, `agent_licenses`
- `leads`, `lead_assignments`, `lead_notes`, `lead_tasks`, `lead_activity`
- `audit_logs`, `consent_records`, `communications`
- `policies`, `commissions`, `agent_applications`, `contact_messages`
- `appointments`, `webhook_events`, `system_settings`

Enums are used for roles, lead statuses, task workflow, consent types, communication channels, and policy/commission placeholders. The migration also creates indexes for the CRM filters that matter immediately: lead status, assigned agent, created date, state, source, score, email, phone, task due dates, audit log lookup, and lead timelines.

Migrations should be the only source of database structure changes. Manual Supabase dashboard edits should be limited to environment configuration, OAuth provider setup, and one-time admin bootstrap.

## 3. Supabase RLS Policy Plan

RLS is enabled on every sensitive table. The core policy shape is:

- Anonymous visitors can insert quote leads, contact messages, and agent applications, but cannot read them.
- Pending users can only read their own profile and cannot access CRM tables.
- Agents can read assigned leads, add notes/tasks for assigned leads, and update limited workflow fields.
- Managers can see leads assigned to agents on their team.
- Admins can manage all business records.
- Audit logs are admin-readable and service-writable.
- Policies and commissions are restricted to admins/managers and the assigned agent where applicable.

The app still uses server-side role checks for dashboard actions. RLS is treated as the hard backstop, not the only line of defense.

## 4. Auth And Role Model Including Google Sign-In

Supported auth methods from day one:

- Email/password
- Google OAuth through Supabase Auth
- Password reset
- Protected dashboard routes
- Role-based post-login routing

Roles:

- `pending`
- `admin`
- `manager`
- `agent`
- `client`
- `support`

New Supabase Auth users are mirrored into `profiles` with role `pending` and status `pending`. This includes Google-authenticated users. A Google login never creates admin access automatically.

Google OAuth setup belongs in Google Cloud and Supabase Auth provider settings. The app only uses public Supabase URL/anon key in the browser and keeps service role access server-only.

## 5. Pending User Approval Workflow

1. User signs up with email/password or Google.
2. Database trigger creates a `profiles` row with `role = pending`.
3. Login routing checks the profile role.
4. Pending users are sent to `/pending-approval`.
5. Admin reviews pending users in `/admin/users`.
6. Admin assigns role and activates the profile.
7. Approved user receives a minimal notification email when configured.

First admin bootstrap:

1. Create the first user through normal sign-up.
2. Run a one-time SQL update in Supabase:

```sql
update public.profiles
set role = 'admin',
    status = 'active',
    approved_at = now()
where email = 'founder@example.com';
```

## 6. Lead Workflow Model

The quote form writes a lead through a server action:

1. Validate all fields server-side with Zod.
2. Require TCPA and privacy consent.
3. Capture tracking data, referrer, user agent, and IP where available.
4. Calculate lead score and temperature.
5. Attempt assignment to an active licensed agent.
6. Insert the lead.
7. Insert consent records.
8. Insert lead activity events.
9. Insert audit log events.
10. Send a minimal notification email.
11. Redirect to `/thank-you`.

Medical and underwriting details stay out of email notifications.

## 7. Assignment Workflow

MVP assignment:

- Match lead state to active agent licenses.
- Require `accepts_new_leads = true`.
- Prefer agents under capacity.
- Use the oldest `last_assigned_at` as a simple round-robin tie breaker.
- Leave unassigned when no licensed active agent is available.
- Record assignment history and activity.

Future assignment should move into a Postgres RPC with row-level locking once assignment volume grows.

## 8. Communication Workflow

Business logic calls provider-neutral functions:

- `sendEmail()`
- `sendSms()`
- `logCommunication()`
- `sendNewLeadNotification()`
- `sendPendingUserNotification()`
- `sendUserApprovedNotification()`

Resend is the MVP email provider. Signalhouse should complement, not replace, the communications table when SMS/calling is added. All outbound lead-related communication should eventually be logged.

The CRM communication layer includes:

- Lead-linked outbound email through Resend with `communications` logging.
- Lead-linked internal chat through `chat_threads` and `chat_messages`.
- Company-wide internal group chat for admins, managers, agents, and support.
- Recipient-scoped `crm_notifications` for new leads, assignments, lead chat, internal chat, and email activity.
- A CRM notification bar that can subscribe to Supabase Realtime for live updates.

Agents must only see lead communications for leads assigned to them. Internal company chat is available to active CRM users; future team-specific rooms can use `chat_visibility = team`.

## 9. MVP Build Sequence

1. Secure foundation: app scaffold, env files, Supabase clients, auth callback, middleware, role routing, schema, RLS.
2. Public website: home, quote, about, education, agent opportunity, contact, thank-you, login, pending approval.
3. Lead capture: quote form validation, scoring, assignment, consent records, activity, minimal notification.
4. Admin CRM: lead list, filters, lead detail, notes, tasks, assignment, pending user approval, communication history, lead chat, notification bar.
5. Agent portal: assigned leads only, notes, tasks, basic metrics, lead communication, internal chat.
6. Workflow automation: SLA reminders, overdue task alerts, communication logging.
7. Expansion: client portal, document upload, policy/commission depth, calendar, e-signature, advanced reporting.

## 10. File And Folder Structure

```text
src/
  app/
    (public)/
    (auth)/
    (dashboard)/
  components/
    auth/
    dashboard/
    forms/
    layout/
    lead/
    ui/
  lib/
    auth/
    constants/
    email/
    notifications/
    sms/
    supabase/
    validation/
  server/
    actions/
    queries/
  types/
supabase/
  migrations/
  seed.sql
docs/
```

## 11. First Working Version Implementation Plan

The first working version proves the business engine:

- A visitor submits the quote form.
- The lead is validated, scored, assigned where possible, and stored securely.
- Consent records and activity are created.
- A minimal notification is sent through Resend when configured.
- CRM notifications are created for new leads and assignments.
- Auth supports email/password, Google sign-in, password reset, pending approval, and protected routes.
- An approved admin can view leads in the dashboard.

Everything else should build outward from that vertical flow.
