-- CFP Tracker database schema
-- Run this in the Supabase SQL editor for a fresh project.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

do $$ begin
  create type team_role as enum ('owner', 'member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type event_format as enum ('Virtual', 'In-person', 'Hybrid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type proposal_status as enum (
    'Idea',
    'Drafting',
    'Ready for Review',
    'Submitted',
    'Accepted',
    'Slides in Progress',
    'Presented',
    'Waitlisted',
    'Rejected',
    'Archived'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role team_role not null default 'member',
  created_at timestamptz not null default now(),
  unique(team_id, user_id)
);

create table if not exists public.people (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  email text,
  bio text,
  bio_type_or_length text,
  organization text,
  role text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conferences (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  organization text not null,
  location text,
  format event_format not null default 'Virtual',
  conference_start_date date,
  conference_end_date date,
  proposal_deadline date not null,
  cfp_url text,
  submission_portal_url text,
  theme text,
  session_formats text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  conference_id uuid not null references public.conferences(id) on delete restrict,
  primary_owner_id uuid not null references public.people(id) on delete restrict,
  title text not null,
  short_description text,
  abstract text,
  learning_outcomes text,
  status proposal_status not null default 'Idea',
  submission_date date,
  decision_date date,
  result text,
  tags_topics text,
  needed_materials text,
  notes text,
  draft_link text,
  submission_confirmation_note text,
  presentation_datetime timestamptz,
  session_format_selected text,
  review_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposal_people (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  role text,
  created_at timestamptz not null default now(),
  unique(proposal_id, person_id)
);

create table if not exists public.share_links (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_teams_updated_at on public.teams;
create trigger touch_teams_updated_at before update on public.teams for each row execute function public.touch_updated_at();

drop trigger if exists touch_people_updated_at on public.people;
create trigger touch_people_updated_at before update on public.people for each row execute function public.touch_updated_at();

drop trigger if exists touch_conferences_updated_at on public.conferences;
create trigger touch_conferences_updated_at before update on public.conferences for each row execute function public.touch_updated_at();

drop trigger if exists touch_proposals_updated_at on public.proposals;
create trigger touch_proposals_updated_at before update on public.proposals for each row execute function public.touch_updated_at();

create or replace function public.assert_proposal_relationships()
returns trigger
language plpgsql
as $$
declare
  conference_team uuid;
  owner_team uuid;
begin
  select team_id into conference_team from public.conferences where id = new.conference_id;
  select team_id into owner_team from public.people where id = new.primary_owner_id;

  if conference_team is null or conference_team <> new.team_id then
    raise exception 'Conference must belong to the same team as the proposal.';
  end if;

  if owner_team is null or owner_team <> new.team_id then
    raise exception 'Primary owner must belong to the same team as the proposal.';
  end if;

  return new;
end;
$$;

drop trigger if exists assert_proposal_relationships on public.proposals;
create trigger assert_proposal_relationships before insert or update on public.proposals for each row execute function public.assert_proposal_relationships();

create or replace function public.assert_proposal_person_relationships()
returns trigger
language plpgsql
as $$
declare
  proposal_team uuid;
  person_team uuid;
begin
  select team_id into proposal_team from public.proposals where id = new.proposal_id;
  select team_id into person_team from public.people where id = new.person_id;

  if proposal_team is null or person_team is null or proposal_team <> person_team then
    raise exception 'Co-presenter must belong to the same team as the proposal.';
  end if;

  return new;
end;
$$;

drop trigger if exists assert_proposal_person_relationships on public.proposal_people;
create trigger assert_proposal_person_relationships before insert or update on public.proposal_people for each row execute function public.assert_proposal_person_relationships();

alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.people enable row level security;
alter table public.conferences enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_people enable row level security;
alter table public.share_links enable row level security;

create or replace function public.is_team_member(check_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.team_members
    where team_id = check_team_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_team_owner(check_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.team_members
    where team_id = check_team_id and user_id = auth.uid() and role = 'owner'
  );
$$;

drop policy if exists "team members can read teams" on public.teams;
create policy "team members can read teams" on public.teams
for select using (public.is_team_member(id));

drop policy if exists "owners can update teams" on public.teams;
create policy "owners can update teams" on public.teams
for update using (public.is_team_owner(id)) with check (public.is_team_owner(id));

drop policy if exists "team members can read memberships" on public.team_members;
create policy "team members can read memberships" on public.team_members
for select using (public.is_team_member(team_id));

drop policy if exists "owners can manage memberships" on public.team_members;
create policy "owners can manage memberships" on public.team_members
for all using (public.is_team_owner(team_id)) with check (public.is_team_owner(team_id));

drop policy if exists "team members can manage people" on public.people;
create policy "team members can manage people" on public.people
for all using (public.is_team_member(team_id)) with check (public.is_team_member(team_id));

drop policy if exists "team members can manage conferences" on public.conferences;
create policy "team members can manage conferences" on public.conferences
for all using (public.is_team_member(team_id)) with check (public.is_team_member(team_id));

drop policy if exists "team members can manage proposals" on public.proposals;
create policy "team members can manage proposals" on public.proposals
for all using (public.is_team_member(team_id)) with check (public.is_team_member(team_id));

drop policy if exists "team members can manage proposal people" on public.proposal_people;
create policy "team members can manage proposal people" on public.proposal_people
for all using (
  exists (
    select 1 from public.proposals p
    where p.id = proposal_id and public.is_team_member(p.team_id)
  )
) with check (
  exists (
    select 1 from public.proposals p
    where p.id = proposal_id and public.is_team_member(p.team_id)
  )
);

drop policy if exists "team members can manage share links" on public.share_links;
create policy "team members can manage share links" on public.share_links
for all using (public.is_team_member(team_id)) with check (public.is_team_member(team_id));

create or replace function public.create_team_for_current_user(team_name text, first_person_name text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_team_id uuid;
  display_name text;
begin
  if auth.uid() is null then
    raise exception 'You must be logged in to create a team.';
  end if;

  if team_name is null or length(trim(team_name)) = 0 then
    raise exception 'Team name is required.';
  end if;

  insert into public.teams(name) values (trim(team_name)) returning id into new_team_id;
  insert into public.team_members(team_id, user_id, role) values (new_team_id, auth.uid(), 'owner');

  display_name := nullif(trim(coalesce(first_person_name, '')), '');
  if display_name is not null then
    insert into public.people(team_id, name, email, role)
    values (new_team_id, display_name, auth.email(), 'Primary owner');
  end if;

  return new_team_id;
end;
$$;

create or replace function public.get_shared_view(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  link_record public.share_links%rowtype;
  payload jsonb;
begin
  select * into link_record
  from public.share_links
  where token = p_token
    and is_active = true
    and (expires_at is null or expires_at > now())
  limit 1;

  if link_record.id is null then
    return null;
  end if;

  select jsonb_build_object(
    'team_name', t.name,
    'generated_at', now(),
    'proposals', coalesce(jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'team_id', p.team_id,
        'conference_id', p.conference_id,
        'primary_owner_id', p.primary_owner_id,
        'title', p.title,
        'short_description', p.short_description,
        'abstract', p.abstract,
        'learning_outcomes', p.learning_outcomes,
        'status', p.status,
        'submission_date', p.submission_date,
        'decision_date', p.decision_date,
        'result', p.result,
        'tags_topics', p.tags_topics,
        'needed_materials', p.needed_materials,
        'notes', p.notes,
        'draft_link', p.draft_link,
        'submission_confirmation_note', p.submission_confirmation_note,
        'presentation_datetime', p.presentation_datetime,
        'session_format_selected', p.session_format_selected,
        'review_due_date', p.review_due_date,
        'conference', jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'organization', c.organization,
          'proposal_deadline', c.proposal_deadline,
          'format', c.format,
          'theme', c.theme,
          'session_formats', c.session_formats,
          'cfp_url', c.cfp_url,
          'submission_portal_url', c.submission_portal_url
        ),
        'primary_owner', jsonb_build_object(
          'id', owner.id,
          'name', owner.name,
          'email', owner.email,
          'organization', owner.organization,
          'role', owner.role,
          'bio_type_or_length', owner.bio_type_or_length,
          'bio', owner.bio
        )
      ) order by c.proposal_deadline asc nulls last
    ) filter (where p.id is not null), '[]'::jsonb)
  ) into payload
  from public.teams t
  left join public.proposals p on p.team_id = t.id and p.status <> 'Archived'
  left join public.conferences c on c.id = p.conference_id
  left join public.people owner on owner.id = p.primary_owner_id
  where t.id = link_record.team_id
  group by t.name;

  return payload;
end;
$$;
