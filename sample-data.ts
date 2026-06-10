import { Conference, Person, Proposal } from './types';

export const sampleTeam = { id: 'team-demo', name: 'McLendon Library CFP Team' };

export const samplePeople: Person[] = [
  {
    id: 'person-dawn',
    team_id: sampleTeam.id,
    name: 'Dawn Zimmerer',
    email: 'dawn.zimmerer@hindscc.edu',
    organization: 'Hinds Community College',
    role: 'Administrative Librarian',
    bio_type_or_length: '150-word bio',
    bio: 'Administrative Librarian at McLendon Library, Hinds Community College.'
  },
  {
    id: 'person-naomi',
    team_id: sampleTeam.id,
    name: 'Naomi Magola',
    email: 'naomi.magola@example.edu',
    organization: 'Hinds Community College',
    role: 'Reference and Archives Librarian',
    bio_type_or_length: 'Short conference bio',
    bio: 'Reference and Archives Librarian supporting instruction, archives, and AI literacy work.'
  }
];

export const sampleConferences: Conference[] = [
  {
    id: 'conf-mla',
    team_id: sampleTeam.id,
    name: 'Mississippi Library Association Annual Conference',
    organization: 'Mississippi Library Association',
    location: 'Mississippi',
    format: 'In-person',
    conference_start_date: '2026-10-14',
    conference_end_date: '2026-10-16',
    proposal_deadline: '2026-06-30',
    cfp_url: 'https://example.org/cfp',
    submission_portal_url: 'https://example.org/submit',
    theme: 'Future Ready: Stronger Together',
    session_formats: 'Presentation, panel, poster, workshop',
    notes: 'Prioritize practical sessions with clear takeaways.'
  },
  {
    id: 'conf-facrl',
    team_id: sampleTeam.id,
    name: 'FACRL Virtual Annual Conference',
    organization: 'Florida Chapter of ACRL',
    location: 'Online',
    format: 'Virtual',
    conference_start_date: '2026-10-08',
    conference_end_date: '2026-10-09',
    proposal_deadline: '2026-07-15',
    cfp_url: 'https://example.org/facrl-cfp',
    submission_portal_url: 'https://example.org/facrl-submit',
    theme: 'Collaboration and human connection',
    session_formats: 'Presentation, poster, roundtable, lightning round',
    notes: 'Good fit for AI literacy and human connection in libraries.'
  }
];

export const sampleProposals: Proposal[] = [
  {
    id: 'prop-ai-literacy',
    team_id: sampleTeam.id,
    conference_id: 'conf-mla',
    primary_owner_id: 'person-dawn',
    title: 'From AI Anxiety to AI Literacy',
    short_description: 'How one community college library built a campus-wide AI learning ecosystem.',
    abstract: 'This session shares a practical model for building AI literacy across faculty, staff, and students.',
    learning_outcomes: 'Identify AI literacy needs; map library-led interventions; adapt tools for local context.',
    status: 'Ready for Review',
    tags_topics: 'AI literacy, faculty development, community college',
    needed_materials: 'Abstract review, presenter bios, learning outcomes',
    notes: 'Needs final team review before submission.',
    draft_link: 'https://docs.example.org/ai-literacy-draft',
    review_due_date: '2026-06-20',
    session_format_selected: 'Presentation',
    conference: sampleConferences[0],
    primary_owner: samplePeople[0]
  },
  {
    id: 'prop-archive',
    team_id: sampleTeam.id,
    conference_id: 'conf-facrl',
    primary_owner_id: 'person-naomi',
    title: 'Starting an Archive from the Ground Up',
    short_description: 'A practical approach to launching an archives program in a community college library.',
    abstract: 'This proposal outlines workflow, student learning, preservation, and institutional storytelling considerations.',
    learning_outcomes: 'Plan initial archives workflows; identify sustainable staffing models; connect archives to student learning.',
    status: 'Drafting',
    tags_topics: 'archives, student learning, community college',
    needed_materials: 'Draft abstract, project timeline, co-presenter bio',
    notes: 'Potential co-presenter session.',
    draft_link: 'https://docs.example.org/archive-ground-up',
    review_due_date: '2026-07-01',
    session_format_selected: 'Presentation',
    conference: sampleConferences[1],
    primary_owner: samplePeople[1]
  }
];
