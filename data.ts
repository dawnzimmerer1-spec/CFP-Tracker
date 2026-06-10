import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from './supabase-server';
import { Conference, Person, Proposal, ShareLink, Team } from './types';

export async function getSessionOrRedirect() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return { supabase, session };
}

export async function getCurrentTeam() {
  const { supabase, session } = await getSessionOrRedirect();
  const { data, error } = await supabase
    .from('team_members')
    .select('role, team:teams(id, name, created_at, updated_at)')
    .eq('user_id', session.user.id)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data?.team) return { supabase, session, team: null as Team | null, role: null as string | null };
  const team = Array.isArray(data.team) ? data.team[0] : data.team;
  return { supabase, session, team: team as Team, role: data.role as string };
}

export async function requireCurrentTeam() {
  const result = await getCurrentTeam();
  if (!result.team) redirect('/onboarding');
  return result as typeof result & { team: Team };
}

export async function getTeamData() {
  const { supabase, team } = await requireCurrentTeam();
  const [conferencesResult, peopleResult, proposalsResult, shareLinksResult] = await Promise.all([
    supabase.from('conferences').select('*').eq('team_id', team.id).order('proposal_deadline', { ascending: true }),
    supabase.from('people').select('*').eq('team_id', team.id).order('name', { ascending: true }),
    supabase
      .from('proposals')
      .select('*, conference:conferences(*), primary_owner:people(*), proposal_people(id, role, person:people(*))')
      .eq('team_id', team.id)
      .order('created_at', { ascending: false }),
    supabase.from('share_links').select('*').eq('team_id', team.id).order('created_at', { ascending: false })
  ]);

  for (const result of [conferencesResult, peopleResult, proposalsResult, shareLinksResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    team,
    conferences: (conferencesResult.data ?? []) as Conference[],
    people: (peopleResult.data ?? []) as Person[],
    proposals: (proposalsResult.data ?? []) as Proposal[],
    shareLinks: (shareLinksResult.data ?? []) as ShareLink[]
  };
}
