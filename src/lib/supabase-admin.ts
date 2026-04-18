import { createClient } from '@supabase/supabase-js';

// This client uses the service_role key, bypassing RLS and allowing 
// administrative actions like creating users with passwords.
// NEVER use this in client components.
export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Missing Supabase Admin environment variables');
    return { auth: { admin: {} }, from: () => ({}) } as any;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
