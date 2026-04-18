'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export const AuthProvider = ({ children }) => {
  const [user, setUser]                 = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth]     = useState(true);
  const [isAdmin, setIsAdmin]           = useState(false);

  // Derive isAdmin: must be authenticated AND the single known admin email.
  // A role check against the profiles table is kept as a second factor.
  const resolveAdmin = async (authUser) => {
    if (!authUser) {
      setIsAdmin(false);
      return;
    }

    // 1. Primary check: If email matches the hardcoded super-admin email, they are an admin.
    if (ADMIN_EMAIL && authUser.email === ADMIN_EMAIL) {
      setIsAdmin(true);
      return;
    }

    // 2. Secondary check: Query the database for the 'admin' role.
    // This allows secondary admins invited via the Team dashboard to gain access.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single();
    
    setIsAdmin(profile?.role === 'admin');
  };

  useEffect(() => {
    // ── Initial session load ──────────────────────────────────────────────
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      setIsAuthenticated(!!authUser);
      await resolveAdmin(authUser);
      setIsLoadingAuth(false);
    });

    // ── Realtime auth state changes ───────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);
        setIsAuthenticated(!!authUser);
        await resolveAdmin(authUser);
        setIsLoadingAuth(false);
      },
    );

    return () => { subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auth actions ────────────────────────────────────────────────────────

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /**
   * Sends a password-reset email.
   * Supabase will redirect the user to /reset-password with the recovery token.
   */
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  /**
   * Updates the authenticated user's password.
   * Must be called from /reset-password after the user arrives via the email link
   * (Supabase sets a temporary session automatically).
   */
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isAdmin,
      login,
      logout,
      resetPassword,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
