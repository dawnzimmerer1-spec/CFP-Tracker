# CFP Tracker Handoff

## Current build status
This package is now a database-connected MVP starter for CFP Tracker.

## What is included
- Product Requirements Document.
- Supabase database schema with row-level security.
- Team onboarding after first login.
- Email magic-link login and auth callback.
- Team-scoped dashboard using Supabase queries.
- Real conference create/edit/delete.
- Real proposal create/edit/delete.
- Real people/bio create/edit/delete.
- Read-only share-link creation and deactivation.
- Public read-only share view through a security-definer RPC.
- CSV, PDF, and Word export buttons.
- Optional seed data script.
- RLS smoke-test script.

## What changed from the first starter
The first starter used sample data for screens and had forms prepared but not wired to Supabase. This version replaces sample screen data with Supabase reads and writes. The sample data file remains only as reference material and can be removed later.

## Setup steps
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. In Supabase Auth settings, add this redirect URL for local development:
   - `http://localhost:3000/api/auth/callback`
4. Copy `.env.example` to `.env.local`.
5. Add your Supabase URL and anon key.
6. Install dependencies with `npm install`.
7. Run locally with `npm run dev`.
8. Open `http://localhost:3000`.
9. Log in with email.
10. Create a team workspace on the onboarding page.
11. Add at least one person and one conference.
12. Add proposals.

## Optional sample data
After logging in and creating a team, run `supabase/seed-sample.sql` from the Supabase SQL editor while authenticated as your test user. If the SQL editor does not carry your auth context, add records through the app instead.

## RLS testing
Use `supabase/rls-test.sql` as a smoke-test checklist. It explains how to verify that one team cannot see another team's conferences or proposals.

Important: RLS should also be tested through the app with two separate test users and two separate teams. The app should confirm that Team A records never appear for Team B.

## Known limitations
- Team invitation flow is not included yet. Version 1 creates a team for the first logged-in user. Additional team membership can be added directly in Supabase for testing.
- Complex permissions are not included. Team members can manage team records.
- Proposal co-presenter linking exists in the database but does not yet have a polished UI picker.
- PDF and Word exports are client-side and intentionally simple.
- No email reminders or calendar sync yet.
- No file uploads. Use draft links.

## Recommended next pass
1. Add owner-only team invitation flow.
2. Add co-presenter multi-select UI.
3. Add filters/search on proposal and conference tables.
4. Add dashboard sorting by deadline.
5. Add private/public export settings so teams can choose whether notes appear in shared exports.
6. Add more tests once the app is deployed.
