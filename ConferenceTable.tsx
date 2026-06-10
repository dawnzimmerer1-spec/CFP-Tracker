'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Conference } from '@/lib/types';
import { ConferenceForm } from './ConferenceForm';

export function ConferenceTable({ teamId, conferences }: { teamId: string; conferences: Conference[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Conference | null>(null);
  const [message, setMessage] = useState('');

  async function deleteConference(conference: Conference) {
    if (!confirm(`Delete conference "${conference.name}"? Proposals connected to it may block deletion.`)) return;
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from('conferences').delete().eq('id', conference.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.refresh();
  }

  if (editing) return <ConferenceForm teamId={teamId} conference={editing} onCancel={() => setEditing(null)} />;

  return (
    <div className="space-y-3">
      {message && <p className="text-sm text-red-700">{message}</p>}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr><th className="px-4 py-3">Conference</th><th className="px-4 py-3">Organization</th><th className="px-4 py-3">Format</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Theme</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {conferences.length === 0 && <tr><td className="px-4 py-6 text-slate-600" colSpan={6}>No conferences yet. Add a CFP and give the deadline beast a leash.</td></tr>}
            {conferences.map((conference) => (
              <tr key={conference.id}>
                <td className="px-4 py-3 font-semibold">{conference.name}</td>
                <td className="px-4 py-3 text-slate-700">{conference.organization}</td>
                <td className="px-4 py-3 text-slate-700">{conference.format}</td>
                <td className="px-4 py-3 text-slate-700">{conference.proposal_deadline}</td>
                <td className="px-4 py-3 text-slate-700">{conference.theme}</td>
                <td className="px-4 py-3"><div className="flex gap-2"><button className="text-sm font-semibold text-ember underline" onClick={() => setEditing(conference)} type="button">Edit</button><button className="text-sm font-semibold text-red-700 underline" onClick={() => deleteConference(conference)} type="button">Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
