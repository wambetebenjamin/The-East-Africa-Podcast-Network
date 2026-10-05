import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions, authProvidersConfigured } from '@/lib/auth';

/**
 * NextAuth route. When no providers are configured (demo mode), respond with
 * a clear message instead of crashing — the rest of the site works and the
 * dashboard runs in demo mode.
 */
const handler = authProvidersConfigured
  ? NextAuth(authOptions)
  : async (req: Request) => {
      const url = new URL(req.url);
      if (url.searchParams.get('getNextAuth') || url.pathname.endsWith('/session')) {
        return NextResponse.json({});
      }
      return NextResponse.json(
        {
          ok: false,
          error: 'Authentication is not configured on this deployment.',
          hint: 'Set NEXTAUTH_SECRET plus GOOGLE_CLIENT_ID/SECRET and SMTP_* env vars to enable Google OAuth and email magic links.',
        },
        { status: 503 }
      );
    };

export { handler as GET, handler as POST };
