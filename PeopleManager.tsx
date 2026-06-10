'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Person } from '@/lib/types';

export function PeopleManager({ teamId, people }: { teamId: string; people: Person[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Person | null>(null);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = {
      team_id: teamId,
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '') || null,
      organization: String(form.get('organization') ?? '') || null,
      role: String(form.get('role') ?? '') || null,
      bio_type_or_length: String(form.get('bio_type_or_length') ?? '') || null,
      bio: String(form.get('bio') ?? '') || null
    };
    const supabase = createBrowserSupabaseClient();
    const result = editing
      ? await supabase.from('people').update(payload).eq('id', editing.id)
      : await supabase.from('people').insert(payload);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setEditing(null);
    event.currentTarget.reset();
    router.refresh();
  }

  async function deletePerson(person: Person) {
    if (!confirm(`Delete person "${person.name}"? Existing proposal ownership may block deletion.`)) return;
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from('people').delete().eq('id', person.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form className="card grid gap-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-black">{editing ? 'Edit person / bio' : 'Add person / bio'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="name">Name *</label><input className="field" id="name" name="name" required defaultValue={editing?.name ?? ''} /></div>
          <div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" defaultValue={editing?.email ?? ''} /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div><label className="label" htmlFor="organization">Organization</label><input className="field" id="organization" name="organization" defaultValue={editing?.organization ?? ''} /></div>
          <div><label className="label" htmlFor="role">Role</label><input className="field" id="role" name="role" defaultValue={editing?.role ?? ''} /></div>
          <div><label className="label" htmlFor="bio_type_or_length">Bio type or length</label><input className="field" id="bio_type_or_length" name="bio_type_or_length" defaultValue={editing?.bio_type_or_length ?? ''} placeholder="50-word bio" /></div>
        </div>
        <div><label className="label" htmlFor="bio">Bio</label><textarea className="field" id="bio" name="bio" rows={4} defaultValue={editing?.bio ?? ''} /></div>
        <div className="flex gap-2"><button className="btn-primary" type="submit">{editing ? 'Update person' : 'Save person'}</button>{editing && <button className="btn-secondary" type="button" onClick={() => setEditing(null)}>Cancel</button>}</div>
        {message && <p className="text-sm text-red-700">{message}</p>}
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {people.map((person) => (
          <article className="card" key={person.id}>
            <h2 className="text-xl font-black">{person.name}</h2>
            <p className="text-slate-700">{person.role} · {person.organization}</p>
            <p className="mt-2 text-sm font-semibold text-ember">{person.bio_type_or_length}</p>
            <p className="mt-3 text-slate-700">{person.bio}</p>
            {person.email && <p className="mt-3 text-sm text-slate-600">{person.email}</p>}
            <div className="mt-4 flex gap-2"><button className="text-sm font-semibold text-ember underline" onClick={() => setEditing(person)} type="button">Edit</button><button className="text-sm font-semibold text-red-700 underline" onClick={() => deletePerson(person)} type="button">Delete</button></div>
          </article>
        ))}
      </div>
    </div>
  );
}
