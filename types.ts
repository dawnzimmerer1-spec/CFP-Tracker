export type ProposalStatus =
  | 'Idea'
  | 'Drafting'
  | 'Ready for Review'
  | 'Submitted'
  | 'Accepted'
  | 'Slides in Progress'
  | 'Presented'
  | 'Waitlisted'
  | 'Rejected'
  | 'Archived';

export type EventFormat = 'Virtual' | 'In-person' | 'Hybrid';
export type TeamRole = 'owner' | 'member';

export interface Team {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
}

export interface Conference {
  id: string;
  team_id: string;
  name: string;
  organization: string;
  location?: string | null;
  format: EventFormat;
  conference_start_date?: string | null;
  conference_end_date?: string | null;
  proposal_deadline: string;
  cfp_url?: string | null;
  submission_portal_url?: string | null;
  theme?: string | null;
  session_formats?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  team_id: string;
  name: string;
  email?: string | null;
  bio?: string | null;
  bio_type_or_length?: string | null;
  organization?: string | null;
  role?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProposalPerson {
  id: string;
  proposal_id: string;
  person_id: string;
  role?: string | null;
  person?: Person;
}

export interface Proposal {
  id: string;
  team_id: string;
  conference_id: string;
  primary_owner_id: string;
  title: string;
  short_description?: string | null;
  abstract?: string | null;
  learning_outcomes?: string | null;
  status: ProposalStatus;
  submission_date?: string | null;
  decision_date?: string | null;
  result?: string | null;
  tags_topics?: string | null;
  needed_materials?: string | null;
  notes?: string | null;
  draft_link?: string | null;
  submission_confirmation_note?: string | null;
  presentation_datetime?: string | null;
  session_format_selected?: string | null;
  review_due_date?: string | null;
  created_at?: string;
  updated_at?: string;
  conference?: Conference | null;
  primary_owner?: Person | null;
  proposal_people?: ProposalPerson[];
}

export interface ShareLink {
  id: string;
  team_id: string;
  token: string;
  is_active: boolean;
  expires_at?: string | null;
  created_at: string;
}
