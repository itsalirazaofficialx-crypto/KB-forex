'use server';

import { getSupabaseAdmin } from './supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Verifies that the current user calling the action is an authorized admin.
 */
async function verifyAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  // Double check the role in the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Unauthorized');
  
  return session.user;
}

/**
 * Creates a new admin user and sets their profile role.
 */
export async function inviteAdmin(formData: FormData) {
  try {
    // 1. Ensure the caller is an admin
    await verifyAdmin();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const adminClient = getSupabaseAdmin();

    // 2. Create the user in Auth
    // We use createUser instead of invite so we can set the password immediately
    const { data: userData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Mark as confirmed immediately
    });

    if (authError) throw authError;

    // 3. Update the profiles table
    // The profile might be created by a DB trigger, so we upsert to be safe.
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        id: userData.user.id,
        email: email,
        role: 'admin'
      });

    if (profileError) throw profileError;

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('[AdminInvite] Error:', error.message);
    return { error: error.message };
  }
}

/**
 * Fetches all admin users.
 */
export async function getAdminUsers() {
  try {
    await verifyAdmin();
    const adminClient = getSupabaseAdmin();
    const { data, error } = await adminClient
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    return [];
  }
}

/**
 * Deletes an admin user (Cannot delete yourself).
 */
export async function deleteAdminUser(id: string) {
  try {
    const caller = await verifyAdmin();
    if (caller.id === id) {
      throw new Error('You cannot delete yourself!');
    }

    const adminClient = getSupabaseAdmin();
    
    // Delete from Auth (this also deletes from profiles if you have a cascade set up, 
    // but we'll try to delete from Auth first)
    const { error: authError } = await adminClient.auth.admin.deleteUser(id);
    if (authError) throw authError;

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
