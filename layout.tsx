import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CFP Tracker',
  description: 'Track conference proposal deadlines, drafts, submissions, and outcomes for library teams.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/dashboard" className="text-xl font-black tracking-tight text-ink">CFP Tracker</Link>
            <div className="flex gap-4 text-sm font-semibold text-slate-700">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/proposals">Proposals</Link>
              <Link href="/conferences">Conferences</Link>
              <Link href="/people">People</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
