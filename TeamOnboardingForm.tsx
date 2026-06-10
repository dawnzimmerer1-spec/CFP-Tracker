'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';

export function TeamOnboardingForm() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.rpc('create_team_for_current_user', {
      team_name: teamName.trim(),
      first_person_name: fullName.trim() || null
    });
    setSaving(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    if (!data) {
      setStatus('The team could not be created. Please try again.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form className="card grid gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="teamName">Team or library name *</label>
        <input className="field" id="teamName" required value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="McLendon Library" />
      </div>
      <div>
        <label className="label" htmlFor="fullName">Your name</label>
        <input className="field" id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Dawn Zimmerer" />
        <p className="mt-1 text-xs text-slate-600">Optional, but useful: this creates your first presenter/owner record.</p>
      </div>
      <button className="btn-primary w-fit" disabled={saving} type="submit">{saving ? 'Creating team...' : 'Create team workspace'}</button>
      {status && <p className="text-sm text-red-700">{status}</p>}
    </form>
  );
}
