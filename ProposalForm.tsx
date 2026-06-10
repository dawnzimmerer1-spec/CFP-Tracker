'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Conference, Person, Proposal, ProposalStatus } from '@/lib/types';

const statuses: ProposalStatus[] = ['Idea','Drafting','Ready for Review','Submitted','Accepted','Slides in Progress','Presented','Waitlisted','Rejected','Archived'];

export function ProposalForm({ teamId, conferences, people, proposal, onCancel }: { teamId: string; conferences: Conference[]; people: Person[]; proposal?: Proposal; onCancel?: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Proposal>>(proposal ?? { status: 'Idea' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const canSave = useMemo(() => conferences.length > 0 && people.length > 0, [conferences.length, people.length]);

  function setField(field: keyof Proposal, value: string) {
    setForm((current) => ({ ...current, [field]: value || null }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const supabase = createBrowserSupabaseClient();
    const payload = {
      team_id: teamId,
      conference_id: form.conference_id,
      primary_owner_id: form.primary_owner_id,
      title: form.title?.trim(),
      short_description: form.short_description || null,
      abstract: form.abstract || null,
      learning_outcomes: form.learning_outcomes || null,
      status: form.status ?? 'Idea',
      submission_date: form.submission_date || null,
      decision_date: form.decision_date || null,
      result: form.result || null,
      tags_topics: form.tags_topics || null,
      needed_materials: form.needed_materials || null,
      notes: form.notes || null,
      draft_link: form.draft_link || null,
      submission_confirmation_note: form.submission_confirmation_note || null,
      presentation_datetime: form.presentation_datetime || null,
      session_format_selected: form.session_format_selected || null,
      review_due_date: form.review_due_date || null
    };

    const result = proposal?.id
      ? await supabase.from('proposals').update(payload).eq('id', proposal.id).select('*').single()
      : await supabase.from('proposals').insert(payload).select('*').single();

    setSaving(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setMessage(proposal?.id ? 'Proposal updated.' : 'Proposal saved.');
    if (!proposal?.id) setForm({ status: 'Idea' });
    router.refresh();
    onCancel?.();
  }

  return (
    <form className="card grid gap-4" aria-label="Create proposal form" onSubmit={handleSubmit}>
      <h2 className="text-xl font-black">{proposal ? 'Edit proposal' : 'Add proposal'}</h2>
      {!canSave && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Add at least one conference and one person before saving a proposal.</p>}
      <div>
        <label className="label" htmlFor="title">Proposal title *</label>
        <input className="field" id="title" name="title" required value={form.title ?? ''} onChange={(event) => setField('title', event.target.value)} placeholder="From AI Anxiety to AI Literacy" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="conference">Conference *</label>
          <select className="field" id="conference" name="conference" required value={form.conference_id ?? ''} onChange={(event) => setField('conference_id', event.target.value)}>
            <option value="">Select conference</option>
            {conferences.map((conference) => <option key={conference.id} value={conference.id}>{conference.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="owner">Primary owner *</label>
          <select className="field" id="owner" name="owner" required value={form.primary_owner_id ?? ''} onChange={(event) => setField('primary_owner_id', event.target.value)}>
            <option value="">Select owner</option>
            {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="status">Status *</label>
          <select className="field" id="status" name="status" required value={form.status ?? 'Idea'} onChange={(event) => setField('status', event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        </div>
        <div>
          <label className="label" htmlFor="review_due_date">Review due date</label>
          <input className="field" id="review_due_date" name="review_due_date" type="date" value={form.review_due_date ?? ''} onChange={(event) => setField('review_due_date', event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="session_format_selected">Session format selected</label>
          <input className="field" id="session_format_selected" name="session_format_selected" value={form.session_format_selected ?? ''} onChange={(event) => setField('session_format_selected', event.target.value)} placeholder="Presentation" />
        </div>
      </div>
      <div><label className="label" htmlFor="short_description">Short description</label><textarea className="field" id="short_description" name="short_description" rows={2} value={form.short_description ?? ''} onChange={(event) => setField('short_description', event.target.value)} /></div>
      <div><label className="label" htmlFor="abstract">Abstract</label><textarea className="field" id="abstract" name="abstract" rows={5} value={form.abstract ?? ''} onChange={(event) => setField('abstract', event.target.value)} /></div>
      <div><label className="label" htmlFor="learning_outcomes">Learning outcomes</label><textarea className="field" id="learning_outcomes" name="learning_outcomes" rows={3} value={form.learning_outcomes ?? ''} onChange={(event) => setField('learning_outcomes', event.target.value)} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label" htmlFor="draft_link">Draft link</label><input className="field" id="draft_link" name="draft_link" type="url" value={form.draft_link ?? ''} onChange={(event) => setField('draft_link', event.target.value)} placeholder="https://..." /></div>
        <div><label className="label" htmlFor="submission_confirmation_note">Submission confirmation number or note</label><input className="field" id="submission_confirmation_note" name="submission_confirmation_note" value={form.submission_confirmation_note ?? ''} onChange={(event) => setField('submission_confirmation_note', event.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div><label className="label" htmlFor="submission_date">Submission date</label><input className="field" id="submission_date" type="date" value={form.submission_date ?? ''} onChange={(event) => setField('submission_date', event.target.value)} /></div>
        <div><label className="label" htmlFor="decision_date">Decision date</label><input className="field" id="decision_date" type="date" value={form.decision_date ?? ''} onChange={(event) => setField('decision_date', event.target.value)} /></div>
        <div><label className="label" htmlFor="presentation_datetime">Presentation date/time</label><input className="field" id="presentation_datetime" type="datetime-local" value={form.presentation_datetime?.slice(0, 16) ?? ''} onChange={(event) => setField('presentation_datetime', event.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label" htmlFor="result">Accepted/rejected result</label><input className="field" id="result" value={form.result ?? ''} onChange={(event) => setField('result', event.target.value)} placeholder="Accepted, rejected, pending, etc." /></div>
        <div><label className="label" htmlFor="tags_topics">Tags/topics</label><input className="field" id="tags_topics" value={form.tags_topics ?? ''} onChange={(event) => setField('tags_topics', event.target.value)} placeholder="AI literacy, archives, assessment" /></div>
      </div>
      <div><label className="label" htmlFor="needed_materials">Needed materials</label><textarea className="field" id="needed_materials" rows={2} value={form.needed_materials ?? ''} onChange={(event) => setField('needed_materials', event.target.value)} /></div>
      <div><label className="label" htmlFor="notes">Notes</label><textarea className="field" id="notes" name="notes" rows={3} value={form.notes ?? ''} onChange={(event) => setField('notes', event.target.value)} /></div>
      <div className="flex gap-2">
        <button className="btn-primary w-fit" disabled={saving || !canSave} type="submit">{saving ? 'Saving...' : proposal ? 'Update proposal' : 'Save proposal'}</button>
        {onCancel && <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
      {message && <p className="text-sm text-slate-700">{message}</p>}
    </form>
  );
}
