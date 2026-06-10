'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Conference, Person, Proposal } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { ProposalForm } from './ProposalForm';

export function ProposalTable({ proposals, conferences = [], people = [], teamId, editable = true }: { proposals: Proposal[]; conferences?: Conference[]; people?: Person[]; teamId?: string; editable?: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Proposal | null>(null);
  const [message, setMessage] = useState('');

  async function deleteProposal(proposal: Proposal) {
    if (!confirm(`Delete proposal "${proposal.title}"? This cannot be undone.`)) return;
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from('proposals').delete().eq('id', proposal.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.refresh();
  }

  if (editing && teamId) {
    return <ProposalForm teamId={teamId} conferences={conferences} people={people} proposal={editing} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="space-y-3">
      {message && <p className="text-sm text-red-700">{message}</p>}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Proposal</th>
              <th className="px-4 py-3">Conference</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Review due</th>
              {editable && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {proposals.length === 0 && (
              <tr><td className="px-4 py-6 text-slate-600" colSpan={editable ? 7 : 6}>No proposals yet. Add one before the deadline gremlins learn your name.</td></tr>
            )}
            {proposals.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-ink">{proposal.title}</td>
                <td className="px-4 py-3 text-slate-700">{proposal.conference?.name}</td>
                <td className="px-4 py-3 text-slate-700">{proposal.conference?.proposal_deadline}</td>
                <td className="px-4 py-3"><StatusBadge status={proposal.status} /></td>
                <td className="px-4 py-3 text-slate-700">{proposal.primary_owner?.name}</td>
                <td className="px-4 py-3 text-slate-700">{proposal.review_due_date ?? 'Not set'}</td>
                {editable && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-sm font-semibold text-ember underline" type="button" onClick={() => setEditing(proposal)}>Edit</button>
                      <button className="text-sm font-semibold text-red-700 underline" type="button" onClick={() => deleteProposal(proposal)}>Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
