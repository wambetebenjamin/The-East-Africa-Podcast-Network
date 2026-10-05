import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions, authProvidersConfigured } from '@/lib/auth';
import { kvGet } from '@/lib/kv';
import Dashboard from '@/components/Dashboard';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic'; // SSR — listener dashboard is per-user

export const metadata: Metadata = {
  title: 'Listener Dashboard',
  description: 'Your listening history, saved episodes, subscriptions and notifications.',
  robots: { index: false },
};

interface HistoryEntry {
  episodeSlug: string;
  position: number;
  duration: number;
  completed: boolean;
  at: string;
}

export default async function DashboardPage() {
  // NextAuth-protected (SSR): session is resolved on the server.
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session && authProvidersConfigured) {
    // Auth is configured but the visitor is not signed in → protected.
    return (
      <section className="site-section">
        <div className="max-w-container mx-auto px-4 text-center py-16">
          <h1 className="text-[30px] font-bold text-ink mb-4">Listener Dashboard</h1>
          <p className="text-body font-light mb-8 max-w-md mx-auto">
            This area is for listeners with an EAPN account. Sign in to see your listening history,
            saved episodes, subscriptions and notifications.
          </p>
          <a href="/api/auth/signin" className="btn-primary-eapn">
            Sign in
          </a>
        </div>
      </section>
    );
  }

  // Signed in — fetch the user's history server-side (Vercel KV).
  let history: HistoryEntry[] = [];
  if (session?.user?.email) {
    history = (await kvGet<HistoryEntry[]>(`history:${session.user.email}`)) ?? [];
  }

  return (
    <section className="site-section">
      <div className="max-w-container mx-auto px-4">
        <Reveal className="mb-10">
          <p className="text-primary uppercase tracking-[0.2em] text-[12px] font-light mb-2">
            Listener Dashboard
          </p>
          <h1 className="text-[30px] md:text-[38px] font-black text-ink">
            {session?.user?.name ? `Karibu tena, ${session.user.name.split(' ')[0]}.` : 'Your listening.'}
          </h1>
        </Reveal>
        <Reveal variant="fade">
          <Dashboard
            session={session?.user ? { name: session.user.name, email: session.user.email } : null}
            serverHistory={history}
          />
        </Reveal>
      </div>
    </section>
  );
}
