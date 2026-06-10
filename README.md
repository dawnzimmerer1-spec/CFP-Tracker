# CFP Tracker

CFP Tracker is a small web app for library teams that need to track conference calls for proposals, proposal drafts, deadlines, presenters, bios, submission status, acceptance outcomes, and presentation follow-up.

## Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Row-Level Security
- jsPDF for PDF export
- docx for Word export

## Features in this package
- Email magic-link login.
- Team onboarding after first login.
- Supabase-backed team workspace.
- Conference create/edit/delete.
- Proposal create/edit/delete.
- People/bio create/edit/delete.
- Dashboard using real Supabase data.
- Read-only share-link creation and deactivation.
- Public shared proposal view.
- CSV, PDF, and Word export.
- RLS schema and smoke-test notes.

## Local setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. In Supabase Auth settings, add the redirect URL:
   - `http://localhost:3000/api/auth/callback`
4. Copy `.env.example` to `.env.local`.
5. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Install dependencies:

```bash
npm install
```

7. Run the app:

```bash
npm run dev
```

8. Open `http://localhost:3000`.

## First use
1. Log in with email.
2. Create a team workspace.
3. Add at least one person.
4. Add at least one conference.
5. Add a proposal.
6. Create a read-only share link from the dashboard.
7. Export proposals from the dashboard or proposal page.

## Database and security
The schema uses Supabase row-level security. Team-scoped tables are protected with policies that call `public.is_team_member(team_id)`. Team onboarding uses `public.create_team_for_current_user(...)` because creating a team and first membership requires a safe security-definer function.

The public shared view uses `public.get_shared_view(token)` so public viewers can see only the data attached to an active share link and cannot edit records.

## Testing RLS
Use `supabase/rls-test.sql` as a manual smoke-test guide. At minimum, create two test users and two teams. Confirm that each user can see only their own team records.

## Production notes
Before public launch:
- Add team invitation flow.
- Add co-presenter UI.
- Add filters/search.
- Add better export privacy controls.
- Verify RLS with two real test accounts.
- Add hosted deployment variables in Vercel.
