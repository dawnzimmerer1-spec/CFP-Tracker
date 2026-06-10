'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Conference } from '@/lib/types';

const emptyConference: Partial<Conference> = { format: 'Virtual' };

export function ConferenceForm({ teamId, conference, onCancel }: { teamId: string; conference?: Conference; onCancel?: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Conference>>(conference ?? emptyConference);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function setField(field: keyof Conference, value: string) {
    setForm((current) => ({ ...current, [field]: value || null }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const supabase = createBrowserSupabaseClient();
    const payload = {
      team_id: teamId,
      name: form.name?.trim(),
      organization: form.organization?.trim(),
      format: form.format ?? 'Virtual',
      location: form.location || null,
      conference_start_date: form.conference_start_date || null,
      conference_end_date: form.conference_end_date || null,
      proposal_deadline: form.proposal_deadline,
      cfp_url: form.cfp_url || null,
      submission_portal_url: form.submission_portal_url || null,
      theme: form.theme || null,
      session_formats: form.session_formats || null,
      notes: form.notes || null
    };

    const result = conference?.id
      ? await supabase.from('conferences').update(payload).eq('id', conference.id).select('*').single()
      : await supabase.from('conferences').insert(payload).select('*').single();

    setSaving(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setMessage(conference?.id ? 'Conference updated.' : 'Conference saved.');
    if (!conference?.id) setForm(emptyConference);
    router.refresh();
    onCancel?.();
  }

  return (
    <form className="card grid gap-4" aria-label="Create conference form" onSubmit={handleSubmit}>
      <h2 className="text-xl font-black">{conference ? 'Edit conference / CFP' : 'Add conference / CFP'}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label" htmlFor="name">Conference name *</label><input className="field" id="name" required value={form.name ?? ''} onChange={(event) => setField('name', event.target.value)} /></div>
        <div><label className="label" htmlFor="organization">Organization *</label><input className="field" id="organization" required value={form.organization ?? ''} onChange={(event) => setField('organization', event.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div><label className="label" htmlFor="format">Format *</label><select className="field" id="format" required value={form.format ?? 'Virtual'} onChange={(event) => setField('format', event.target.value)}><option>Virtual</option><option>In-person</option><option>Hybrid</option></select></div>
        <div><label className="label" htmlFor="location">Location</label><input className="field" id="location" value={form.location ?? ''} onChange={(event) => setField('location', event.target.value)} /></div>
        <div><label className="label" htmlFor="proposal_deadline">Proposal deadline *</label><input className="field" id="proposal_deadline" type="date" required value={form.proposal_deadline ?? ''} onChange={(event) => setField('proposal_deadline', event.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label" htmlFor="conference_start_date">Conference start date</label><input className="field" id="conference_start_date" type="date" value={form.conference_start_date ?? ''} onChange={(event) => setField('conference_start_date', event.target.value)} /></div>
        <div><label className="label" htmlFor="conference_end_date">Conference end date</label><input className="field" id="conference_end_date" type="date" value={form.conference_end_date ?? ''} onChange={(event) => setField('conference_end_date', event.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label" htmlFor="cfp_url">CFP URL</label><input className="field" id="cfp_url" type="url" value={form.cfp_url ?? ''} onChange={(event) => setField('cfp_url', event.target.value)} placeholder="https://..." /></div>
        <div><label className="label" htmlFor="submission_portal_url">Submission portal URL</label><input className="field" id="submission_portal_url" type="url" value={form.submission_portal_url ?? ''} onChange={(event) => setField('submission_portal_url', event.target.value)} placeholder="https://..." /></div>
      </div>
      <div><label className="label" htmlFor="theme">Theme</label><input className="field" id="theme" value={form.theme ?? ''} onChange={(event) => setField('theme', event.target.value)} /></div>
      <div><label className="label" htmlFor="session_formats">Session formats</label><input className="field" id="session_formats" value={form.session_formats ?? ''} onChange={(event) => setField('session_formats', event.target.value)} placeholder="Workshop, panel, poster" /></div>
      <div><label className="label" htmlFor="notes">Notes</label><textarea className="field" id="notes" rows={3} value={form.notes ?? ''} onChange={(event) => setField('notes', event.target.value)} /></div>
      <div className="flex gap-2">
        <button className="btn-primary w-fit" disabled={saving} type="submit">{saving ? 'Saving...' : conference ? 'Update conference' : 'Save conference'}</button>
        {onCancel && <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
      {message && <p className="text-sm text-slate-700">{message}</p>}
    </form>
  );
}
