# Retirement Income Blueprint landing page

The QR landing page is available at `/retirement`. Its form is handled by a Next.js Server Action, stored in Supabase, and optionally routed to email and a CRM webhook. No routing secret or destination is shipped to the browser.

## Recommended QR destination

Use this URL in the final direct-mail QR code:

```text
https://rarelegacylife.com/retirement?utm_source=eddm&utm_medium=direct_mail&utm_campaign=retirement_blueprint&qr_source=retirement_mailer
```

UTM parameters, supported ad click IDs, the landing URL, and the referrer are preserved with each submission.

## Required deployment configuration

The existing Supabase and Resend variables continue to power the integration. Configure the retirement-specific values in Vercel as server-side environment variables.

| Environment variable | Purpose | Required |
| --- | --- | --- |
| `RETIREMENT_LEAD_NOTIFICATION_EMAIL` | Mailbox for new-request notifications. Multiple addresses may be comma-separated. Falls back to `ADMIN_NOTIFICATION_EMAIL`. | Yes for email routing |
| `RETIREMENT_SPECIALIST_AGENT_ID` | UUID of the active specialist in `public.agents`; assigns the request and adds the agent email to notifications. | Optional |
| `RETIREMENT_CRM_WEBHOOK_URL` | HTTPS endpoint that receives a `retirement_blueprint.requested` JSON payload. | Optional |
| `RETIREMENT_CRM_WEBHOOK_BEARER_TOKEN` | Bearer token attached only to the outbound CRM webhook. | Recommended with webhook |
| `RETIREMENT_APPOINTMENT_WEBHOOK_SECRET` | Bearer secret protecting the successful-appointment endpoint. | Required for appointment webhook |
| `BUSINESS_PHONE` | Business phone included in the confirmation email when configured. | Optional |
| `RETIREMENT_PRIVACY_POLICY_URL` | Privacy-policy URL used in the confirmation email. | Yes |

The shared variables `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NEXT_PUBLIC_SITE_URL` must also remain configured. The Supabase service-role key, email API key, webhook URL, notification address, and webhook tokens must never use a `NEXT_PUBLIC_` prefix.

## Supabase

Apply `supabase/migrations/202608270001_retirement_blueprint.sql`. It creates:

- `retirement_blueprint_requests` for form submissions, consent evidence, routing, and attribution.
- `retirement_landing_events` for funnel analytics.

Both tables have Row Level Security enabled, deny browser roles, and grant access only to the server-side service role.

## CRM webhook

When `RETIREMENT_CRM_WEBHOOK_URL` is set, the server posts this event after the Supabase insert succeeds:

```json
{
  "event": "retirement_blueprint.requested",
  "requestId": "uuid",
  "name": "Prospect Name",
  "email": "prospect@example.com",
  "phone": "+1 215 555 0123",
  "zipCode": "19403",
  "meetingStyle": "virtual",
  "bestTime": "Weekdays after 4 p.m.",
  "question": null,
  "assignedAgentId": null,
  "attribution": {
    "utm_source": "eddm",
    "utm_medium": "direct_mail",
    "utm_campaign": "retirement_blueprint",
    "utm_content": null,
    "utm_term": null,
    "qr_source": "retirement_mailer"
  },
  "submittedAt": "ISO-8601 timestamp"
}
```

Webhook delivery is best-effort: Supabase remains the source of truth if the downstream CRM is unavailable.

## Successful appointment tracking

The funnel records these events in Supabase and also pushes them to `window.dataLayer`:

- `qr_landing_visit`
- `meeting_option_click`
- `form_start`
- `form_submission`
- `form_submission_success`
- `form_validation_error`
- `form_submission_error`
- `successful_appointment`

For a scheduler or CRM, send a server-to-server request after an appointment is confirmed:

```http
POST /api/retirement/appointment-confirmed
Authorization: Bearer [RETIREMENT_APPOINTMENT_WEBHOOK_SECRET]
Content-Type: application/json
```

```json
{
  "request_id": "uuid returned with the lead",
  "appointment_id": "scheduler-event-id",
  "scheduled_at": "2026-09-15T14:00:00-04:00",
  "meeting_style": "virtual"
}
```

The endpoint marks the request `scheduled` and records `successful_appointment`. A hosted scheduler may also redirect to `/retirement?appointment=confirmed&appointment_id=...` for client-side analytics, but the authenticated webhook is the authoritative signal.

## Form behavior and spam controls

- Server-side Zod validation
- Consent text, version, timestamp, IP, and user agent retained with the submission
- Honeypot and minimum-completion-time checks
- Per-email submission throttling in Supabase
- Event-endpoint rate limiting and payload limits
- Branded confirmation email through the existing Resend integration

The on-page consent and footer disclosures are deliberately labeled as compliance drafts. Legal/compliance review is required before the production campaign launches.
