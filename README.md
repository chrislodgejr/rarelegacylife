# Rare Legacy Life

Rare Legacy Life is a secure Next.js, Supabase, and Vercel platform for a life insurance public website, lead funnel, CRM, and agent portal.

## MVP Scope

- Public website pages for home, quote, about, education, agent opportunity, contact, thank-you, login, and pending approval.
- Supabase Auth with email/password, Google OAuth, password reset, protected routes, and pending user flow.
- Supabase email OTP/passwordless login UI with a branded verification screen.
- Supabase Postgres schema with RLS, enums, indexes, audit logs, consent records, communications, policies, and commissions placeholders.
- Quote form with server-side validation, consent capture, lead scoring, assignment, activity, audit logging, and minimal Resend notification.
- Admin CRM starter: dashboard, lead list, lead detail, notes, tasks, assignment, users, agents.
- Lead communication starter: logged outbound email, internal lead chat, company group chat, and live notification bar.
- Agent portal starter: assigned lead dashboard, assigned lead list/detail, notes, tasks, lead communication, internal chat, and performance placeholder.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Create a Supabase project and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key must stay server-only. Never expose it in browser code.

4. Apply database migrations:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

5. Run seed settings:

```bash
supabase db reset
```

For a remote project, run the contents of `supabase/seed.sql` through your normal migration/seed workflow.

6. Start the app:

```bash
npm run dev
```

## First Admin Bootstrap

1. Sign up through `/login` using email/password or Google.
2. In Supabase SQL editor, run:

```sql
update public.profiles
set role = 'admin',
    status = 'active',
    approved_at = now()
where email = 'you@yourdomain.com';
```

3. Sign out and sign back in. You should land at `/admin/dashboard`.

## Google OAuth Setup

1. In Google Cloud Console, create OAuth credentials for a web application.
2. In Supabase, open Authentication > Providers > Google.
3. Add the Google Client ID and Client Secret in Supabase.
4. Copy the Supabase Google callback URL into Google Cloud authorized redirect URIs.
5. Set Supabase site URL and redirect URLs for:
   - `http://localhost:3000/auth/callback`
   - Vercel preview callback URLs
   - Production callback URL
6. Enable the Google provider.
7. Test Google sign-in locally and in Vercel preview.

New Google users are created as `pending`. Admin access must be granted manually by an approved admin.

## Email OTP Setup

The login page includes an email-code option using Supabase Auth `signInWithOtp` and `verifyOtp`.
The public quote form also requires the visitor to verify the quote email by OTP before the lead is saved.

To send a six-digit code instead of only a magic link, update the Supabase Auth email template to include the OTP token:

```html
<h2>Rare Legacy Life secure code</h2>
<p>Your one-time login code is: {{ .Token }}</p>
```

Keep the Supabase site URL and redirect URLs pointed at `/auth/callback` for magic-link fallback. OTP-authenticated users still route through `/auth/landing`, where pending users are sent to `/pending-approval` until an admin approves their role.

Phone OTP is intentionally not enabled in the app yet. It requires Supabase phone auth plus an SMS provider configuration, and should complement Signalhouse/SMS decisions later.

## Resend

Set these to enable transactional notifications:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_NOTIFICATION_EMAIL=
```

Lead emails include only minimal details and a secure dashboard link. Medical details are not sent.

## Signalhouse

Signalhouse variables are reserved for later SMS/calling integration:

```bash
SIGNALHOUSE_API_KEY=
SIGNALHOUSE_FROM_NUMBER=
```

The app already has a provider abstraction so SMS/calling can be added without hard-coding Signalhouse into business logic.

## Realtime Notifications

The CRM notification bar listens for inserts on `crm_notifications`. In Supabase, enable Realtime for this table when you are ready for live updates:

```sql
alter publication supabase_realtime add table public.crm_notifications;
```

Notifications are recipient-scoped. Agents should only receive lead notifications for leads assigned to them.

## Useful Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:types
```

## Architecture

See `docs/architecture.md` for the build plan, RLS model, auth workflow, assignment workflow, communication workflow, and phased roadmap.
