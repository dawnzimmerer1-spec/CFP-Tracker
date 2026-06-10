import { ProposalStatus } from '@/lib/types';

const classes: Record<ProposalStatus, string> = {
  Idea: 'bg-slate-100 text-slate-700',
  Drafting: 'bg-blue-100 text-blue-800',
  'Ready for Review': 'bg-amber-100 text-amber-800',
  Submitted: 'bg-purple-100 text-purple-800',
  Accepted: 'bg-green-100 text-green-800',
  'Slides in Progress': 'bg-cyan-100 text-cyan-800',
  Presented: 'bg-emerald-100 text-emerald-800',
  Waitlisted: 'bg-orange-100 text-orange-800',
  Rejected: 'bg-red-100 text-red-800',
  Archived: 'bg-zinc-100 text-zinc-700'
};

export function StatusBadge({ status }: { status: ProposalStatus }) {
  return <span className={`badge ${classes[status]}`}>{status}</span>;
}
