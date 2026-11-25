# /retirement (the QR page) and the retirement quiz

`/retirement` was printed on a mailer's QR code, so its address must stay live. Since 2026-11-25 its only form is the retirement
quiz (Chris: "has conflicting forms now ... the blueprint form isnt connected to any adds"). The Blueprint request form, its
meeting-style picker and the embedded Zoom Scheduler were removed. The quiz is the same one on `/protect` (the Google Ads landing
page), `/retirement/quiz`, `/annuity-calculator` and `/annuity-rates` (`src/components/forms/retirement-quiz.tsx`).

## What a quiz request does

1. The visitor answers one question a screen, then gives first and last name and email, then phone, ZIP and consent.
2. Name-and-email drop-offs are sent to Endless One as `partial` prospects (`src/server/actions/quiz-prospect.ts`, only while
   `QUIZ_PROSPECTS` is `on`).
3. A finished request goes through `src/server/actions/protect-request.ts`: it is stored in `retirement_blueprint_requests` (the
   table keeps its old name and holds every retirement request from the site), sent to Endless One with the page's source
   (`src/lib/quiz.ts` `QUIZ_PAGES`), and reported to Google Ads as RL Form Submit (`src/lib/google-ads.ts`).
4. On `/protect`, each step of the visit is sent to Endless One's form-step report (`src/lib/form-steps.ts`).
5. The thank-you screen links to Christian's Zoom Scheduler. The link carries the request id in `utm_content`, and the tap is
   logged in `retirement_landing_events` as `meeting_option_click` with `metadata.action = "schedule"` and the request id (the table's event-name constraint allows no other name for it), so a booking can be tied to its lead.

## Appointment confirmation

`POST /api/retirement/appointment-confirmed` (bearer `RETIREMENT_APPOINTMENT_WEBHOOK_SECRET`) marks a request `scheduled` and
records `successful_appointment`. As of 2026-11-25 the secret is not set in Vercel and no scheduler calls it, so no booking has
ever been recorded this way; bookings are seen on Christian's Zoom calendar.

```json
{ "request_id": "uuid of the request", "appointment_id": "scheduler-event-id", "scheduled_at": "2026-09-15T14:00:00-04:00" }
```

## Configuration

| Environment variable | Purpose |
| --- | --- |
| `QUIZ_PROSPECTS` | `on` sends name-and-email drop-offs to Endless One as prospects. |
| `ENDLESS_ONE_INTAKE_URL`, `ENDLESS_ONE_INTAKE_SECRET` | Where finished requests and prospects are sent, and the signing secret. |
| `RETIREMENT_APPOINTMENT_WEBHOOK_SECRET` | Protects the appointment-confirmation endpoint (not set today). |

`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `NEXT_PUBLIC_SITE_URL` must stay
configured. Server secrets never use a `NEXT_PUBLIC_` prefix.

## Spam controls

Server-side validation, consent text and version kept with each request, a honeypot and a minimum completion time, per-email
throttling, and rate limits on the event endpoint.
