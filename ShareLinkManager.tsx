'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { ShareLink } from '@/lib/types';

function makeToken() {
  const random = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(random).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function ShareLinkManager({ teamId, initialLinks }: { teamId: string; initialLinks: ShareLink[] }) {
  const [links, setLinks] = useState<ShareLink[]>(initialLinks);
  const [message, setMessage] = useState('');

  async function createShareLink() {
    setMessage('');
    const supabase = createBrowserSupabaseClient();
    const token = makeToken();
    const { data, error } = await supabase
      .from('share_links')
      .insert({ team_id: teamId, token })
      .select('*')
      .single();
    if (error) {
      setMessage(error.message);
      return;
    }
    setLinks([data as ShareLink, ...links]);
  }

  async function deactivateLink(link: ShareLink) {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from('share_links')
      .update({ is_active: false })
      .eq('id', link.id)
      .select('*')
      .single();
    if (error) {
      setMessage(error.message);
      return;
    }
    setLinks(links.map((item) => item.id === link.id ? data as ShareLink : item));
  }

  return (
    <section className="card space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-black">Read-only sharing</h2>
          <p className="text-sm text-slate-700">Create a public read-only view. Anyone with the link can view proposal details, but cannot edit.</p>
        </div>
        <button className="btn-primary w-fit" type="button" onClick={createShareLink}>Create share link</button>
      </div>
      {message && <p className="text-sm text-red-700">{message}</p>}
      <div className="space-y-2">
        {links.length === 0 && <p className="text-sm text-slate-600">No share links yet.</p>}
        {links.map((link) => {
          const url = typeof window !== 'undefined' ? `${window.location.origin}/share/${link.token}` : `/share/${link.token}`;
          return (
            <div className="rounded-xl border border-slate-200 p-3" key={link.id}>
              <p className="break-all text-sm font-semibold"><a className="text-ember underline" href={url} target="_blank">{url}</a></p>
              <p className="text-xs text-slate-600">Status: {link.is_active ? 'Active' : 'Inactive'} · Created: {new Date(link.created_at).toLocaleString()}</p>
              {link.is_active && <button className="btn-secondary mt-2" type="button" onClick={() => deactivateLink(link)}>Turn off link</button>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
