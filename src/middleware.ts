import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase-server';

/**
 * Runs on the Edge before every matched request.
 *
 * Rules:
 *  - /admin/*  → must have a valid Supabase session; redirect to /login otherwise.
 *  - /login    → if already authenticated, redirect to /admin.
 *  - All other routes → pass through freely.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Build a Supabase client that can read/write the auth cookie.
  const supabase = createSupabaseMiddlewareClient(request, response);

  // Refresh the session so the cookie expiry is extended on each request.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  // ── Protect /admin/* ─────────────────────────────────────────────────────
  if (isAdminRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the intended destination so we can redirect back after login.
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Avoid /login when already logged in ──────────────────────────────────
  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Pass through — importantly, we return the mutated `response` so that
  // any Set-Cookie headers written by createSupabaseMiddlewareClient are
  // included in the final response.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *   - _next/static  (Next.js static assets)
     *   - _next/image   (Next.js image optimisation)
     *   - favicon.ico
     *   - /api/*        (API routes handle their own auth)
     *   - public files with an extension (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\..*).*)',
  ],
};
