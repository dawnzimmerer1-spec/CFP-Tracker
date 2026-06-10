import { ConferenceForm } from '@/components/ConferenceForm';
import { ConferenceTable } from '@/components/ConferenceTable';
import { getTeamData } from '@/lib/data';

export default async function ConferencesPage() {
  const { team, conferences } = await getTeamData();
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Conferences and CFPs</h1>
        <p className="mt-2 text-slate-700">Store CFP details, deadlines, themes, session formats, and submission portals.</p>
      </div>
      <ConferenceTable teamId={team.id} conferences={conferences} />
      <ConferenceForm teamId={team.id} />
    </section>
  );
}
