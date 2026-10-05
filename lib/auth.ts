/**
 * NextAuth.js — listener accounts with Google OAuth + email magic link.
 *
 * The Email (magic link) provider requires a database adapter; we implement the
 * adapter on Vercel KV (lib/kv.ts) with an in-memory fallback for local dev.
 * In demo mode (no NEXTAUTH_SECRET / no providers configured) the sign-in route
 * returns a clear message and the dashboard runs in demo mode.
 */
import type { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { kvGet, kvSet } from './kv';

interface KVUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: Date | null;
}
interface KVToken { identifier: string; token: string; expires: Date }
interface KVSession { userId: string; sessionToken: string; expires: Date }
interface KVAccount { userId: string; type: string; provider: string; providerAccountId: string }

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function kvAdapter(): Adapter {
  const adapter: Adapter = {
    createUser: async (user: Partial<KVUser> & { email: string }) => {
      const u: KVUser = { ...user, id: uid() } as KVUser;
      await kvSet(`user:${u.id}`, u);
      await kvSet(`user:email:${u.email}`, u.id);
      return u as never;
    },
    getUser: async (id: string) => ((await kvGet<KVUser>(`user:${id}`)) ?? null) as never,
    getUserByEmail: async (email: string) => {
      const id = await kvGet<string>(`user:email:${email}`);
      if (!id) return null;
      return ((await kvGet<KVUser>(`user:${id}`)) ?? null) as never;
    },
    getUserByAccount: async ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) => {
      const acc = await kvGet<KVAccount>(`account:${provider}:${providerAccountId}`);
      if (!acc) return null;
      return ((await kvGet<KVUser>(`user:${acc.userId}`)) ?? null) as never;
    },
    updateUser: async (user: Partial<KVUser> & { id: string }) => {
      const prev = await kvGet<KVUser>(`user:${user.id}`);
      const next = { ...prev, ...user } as KVUser;
      await kvSet(`user:${user.id}`, next);
      return next as never;
    },
    deleteUser: async (id: string) => {
      const u = await kvGet<KVUser>(`user:${id}`);
      if (u) await kvSet(`user:email:${u.email}`, null as never);
      await kvSet(`user:${id}`, null as never);
    },
    linkAccount: async (account: Record<string, unknown> & KVAccount) => {
      const acc = { ...account } as KVAccount;
      await kvSet(`account:${acc.provider}:${acc.providerAccountId}`, acc);
      return acc as never;
    },
    unlinkAccount: async ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) => {
      await kvSet(`account:${provider}:${providerAccountId}`, null as never);
      return undefined as never;
    },
    createSession: async (session: Partial<KVSession> & { sessionToken: string; userId: string }) => {
      const s: KVSession = { ...session } as KVSession;
      await kvSet(`session:${s.sessionToken}`, s);
      return s as never;
    },
    getSessionAndUser: async (sessionToken: string) => {
      const s = await kvGet<KVSession>(`session:${sessionToken}`);
      if (!s) return null;
      const user = await kvGet<KVUser>(`user:${s.userId}`);
      if (!user) return null;
      return { session: s as never, user: user as never };
    },
    updateSession: async (session: Partial<KVSession> & { sessionToken: string }) => {
      const s = { ...session } as KVSession;
      await kvSet(`session:${s.sessionToken}`, s);
      return s as never;
    },
    deleteSession: async (sessionToken: string) => {
      await kvSet(`session:${sessionToken}`, null as never);
    },
    createVerificationToken: async (token: KVToken) => {
      const t = { ...token } as KVToken;
      await kvSet(`vtoken:${t.token}`, t);
      return t as never;
    },
    useVerificationToken: async ({ identifier, token }: { identifier: string; token: string }) => {
      const t = await kvGet<KVToken>(`vtoken:${token}`);
      if (!t || t.identifier !== identifier) return null;
      await kvSet(`vtoken:${token}`, null as never);
      return t as never;
    },
  };
  return adapter;
}

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export const authProvidersConfigured = googleConfigured || smtpConfigured;

export const authOptions: NextAuthOptions = {
  // Demo fallback secret keeps getServerSession() quiet when auth is not
  // configured; no providers are active in that mode, so nothing is signable.
  secret: process.env.NEXTAUTH_SECRET || 'eapn-demo-secret-not-for-production',
  providers: [
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
        ]
      : []),
    ...(googleConfigured || smtpConfigured
      ? [
          // Email magic link (requires adapter below)
          EmailProvider({
            server: {
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT || 587),
              auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            },
            from: process.env.EMAIL_FROM || 'The East Africa Podcast Network <hello@eapn.africa>',
          }),
        ]
      : []),
  ],
  ...(googleConfigured || smtpConfigured ? { adapter: kvAdapter() } : {}),
  session: { strategy: googleConfigured || smtpConfigured ? 'database' : 'jwt' },
  callbacks: {
    async session({ session, user }) {
      if (user && session.user) (session.user as { id?: string }).id = user.id;
      return session;
    },
  },
  pages: { signIn: '/dashboard' },
};
