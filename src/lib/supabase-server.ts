import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

/**
 * Build a Supabase client that reads/writes cookies from the Edge request/response.
 * Used exclusively in src/middleware.ts — do NOT import in Client Components.
 */
export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    // In production build phase, this might be empty. 
    // Return a dummy client or handle it to prevent build crash.
    return {
      auth: { getSession: async () => ({ data: { session: null } }) },
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }) }) })
    } as any;
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}
