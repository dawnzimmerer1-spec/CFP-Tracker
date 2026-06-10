-- Optional sample data for the currently logged-in user's first team.
-- Run after creating a team through the app.

do $$
declare
  target_team uuid;
  dawn_id uuid;
  conf_id uuid;
begin
  select team_id into target_team from public.team_members where user_id = auth.uid() limit 1;
  if target_team is null then
    raise exception 'Create a team first.';
  end if;

  insert into public.people(team_id, name, email, organization, role, bio_type_or_length, bio)
  values (target_team, 'Dawn Zimmerer', 'dawn.zimmerer@hindscc.edu', 'Hinds Community College', 'Administrative Librarian', '100-word bio', 'Administrative librarian focused on information literacy, AI literacy, and practical faculty development.')
  returning id into dawn_id;

  insert into public.conferences(team_id, name, organization, format, proposal_deadline, theme, session_formats, cfp_url, submission_portal_url)
  values (target_team, 'Mississippi Library Association Annual Conference', 'Mississippi Library Association', 'In-person', current_date + 45, 'Future Ready: Stronger Together', 'Presentation, panel, poster', 'https://example.org/cfp', 'https://example.org/submit')
  returning id into conf_id;

  insert into public.proposals(team_id, conference_id, primary_owner_id, title, status, review_due_date, abstract, tags_topics, session_format_selected)
  values (target_team, conf_id, dawn_id, 'Beyond Prompting: Building AI Workflows That Actually Save Time', 'Drafting', current_date + 14, 'A practical session for redesigning recurring teaching and library tasks into safer, human-reviewed AI workflows.', 'AI literacy, workflows, faculty development', 'Workshop');
end $$;
