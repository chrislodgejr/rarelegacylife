# Rare Legacy CRM release review

Branch: `feature/mobile-crm-pwa-quote-flow`.

## Intent and boundaries

The private CRM is a shared owner workspace for Chris Lodge and Dan Pennachietti. `/quote` stores scored life insurance requests in `leads`; `/retirement` stores mailer and retirement inquiries in `retirement_blueprint_requests`. Both are reachable from the CRM mobile navigation. The existing `/retirement` path and mailer QR destination do not change. No request is assigned to an agent. Public submitters never become CRM users.

The CRM installs as a PWA. Its service worker handles push events only and never caches authenticated data. Web push requires HTTPS, an installed home-screen web app on supported iPhone configurations, device permission, a production VAPID key pair, and the migration. Push payloads contain a generic alert; personal details stay behind sign-in. Mobile navigation exposes dashboard, quotes, retirement, and settings. Retirement cases include discovery, follow-up tasks, stage, and contact history; carrier illustrations, suitability decisions, application submission, document storage, and policy service remain outside this release. Do not portray internal notes as a recommendation or approved illustration.

## Two owner accounts

Keep exactly:

- `chris@endlessconsulting.co` (active admin and most recent Chris sign-in)
- `dan@endlessconsulting.co` (active admin)

Other seven Auth identities at inspection time:

- `chrislodgejr@me.com` (older Chris agent identity)
- `chrislodgejr@gmail.com` (older Chris client identity)
- `chrisallen.fcg@gmail.com`
- `kerribrown.fcg@gmail.com`
- `tara@covarum.com`
- `krystlestanley.fcg@gmail.com`
- `marcea02@gmail.com`

The migration deactivates their profiles and agents without deleting historical agency records. Existing CRM sessions lose application and RLS data access after this migration because `has_role` checks active status. Authentication users remain until a separately reviewed removal: deleting an Auth user cascades to its profile and can erase chat participation and notification history. Inspect record retention and export those records first; then ban/revoke sessions and delete the seven Auth identities by exact ID in the Supabase admin interface. Disable new Auth sign-ups in project settings before release. Quote email verification uses its own server-only table, not Supabase Auth.

## Release sequence

1. Review branch diff and migration against production schema. Back up the database and confirm which Chris email is the retained sign-in. Confirm Chris and Dan can each sign in before deactivating any identity.
2. Generate VAPID keys securely. Configure `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT=mailto:...` for the Vercel project. Never send the private key to a browser. Keep existing Resend, Supabase, and retirement notification settings.
3. Apply `supabase/migrations/202609250001_mobile_crm.sql` to the Rare Legacy project `wryekvvejmprulrwaltk`, then verify row-level security, quote deduplication and the two active owners. This changes live access, so it must be part of the approved release.
4. Deploy the matching commit to preview, verify sign-ins, both CRM inboxes and task updates, the manifest and service worker; submit a non-customer quote only in an isolated test environment with test email delivery. Verify the OTP immediately submits and redirects once; an invalid code does not create a lead. Check push on an installed device using a test notification.
5. Promote after approval. Confirm both public URLs, one real staged inquiry of each type (with consent), notification recipients, and CRM display; then evaluate the seven account deletions separately with the historical-record inventory.

## Validation already completed

ESLint, TypeScript and `next build` pass locally with build-time placeholder publishable Supabase configuration. No live form submission, DB migration, VAPID provisioning, push delivery, preview deployment, or production change was performed by this branch.

## Future Endless One integration

Retain stable UUIDs and source labels. Add a versioned authenticated API for a future native client; do not call the PWA server actions directly from Endless One. Enforce the same owner authorization and audit rules at the API boundary. Keep business data scoped to Rare Legacy.
