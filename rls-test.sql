-- CFP Tracker row-level-security smoke tests
-- Run these in a Supabase SQL editor AFTER creating two auth users and replacing the placeholder UUIDs.
-- The tests use Postgres request.jwt.claim.sub to simulate authenticated users.

-- 1. Replace these with real auth.users IDs from your test project.
-- select id, email from auth.users;

-- Example placeholders:
-- Team A user: 00000000-0000-0000-0000-000000000001
-- Team B user: 00000000-0000-0000-0000-000000000002

-- 2. Act as Team A user and create a team.
-- select set_config('request.jwt.claim.sub', 'TEAM_A_USER_UUID', true);
-- select public.create_team_for_current_user('Team A Library', 'Team A Owner');
-- insert into public.conferences(team_id, name, organization, format, proposal_deadline)
-- select team_id, 'Team A Conference', 'ACRL', 'Virtual', current_date + 30
-- from public.team_members where user_id = 'TEAM_A_USER_UUID'::uuid limit 1;

-- 3. Act as Team B user and create a team.
-- select set_config('request.jwt.claim.sub', 'TEAM_B_USER_UUID', true);
-- select public.create_team_for_current_user('Team B Library', 'Team B Owner');

-- 4. Team B should not see Team A records. This should return zero rows.
-- select * from public.conferences where name = 'Team A Conference';

-- 5. Team B should not be able to insert into Team A. This should fail RLS.
-- insert into public.conferences(team_id, name, organization, format, proposal_deadline)
-- values ('TEAM_A_ID_HERE'::uuid, 'Sneaky Goblin Conference', 'Nope', 'Virtual', current_date + 10);

-- 6. Share-link read should work only through get_shared_view(token), not table access.
-- Team members can create a share link. Anonymous users should not be able to directly select team tables.
