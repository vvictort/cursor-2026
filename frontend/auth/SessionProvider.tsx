import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { getAuthRedirectUrl } from './redirect';

type SignInResult = { error: AuthError | null };
type SignUpResult = {
  error: AuthError | null;
  requiresEmailConfirmation: boolean;
  alreadyRegistered: boolean;
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string): Promise<SignUpResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('[SignUp] Attempting signup for:', normalizedEmail);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });

    console.log('[SignUp] Supabase response:', {
      hasUser: !!data?.user,
      userId: data?.user?.id,
      hasSession: !!data?.session,
      error: error?.message ?? null,
      identitiesCount: data?.user?.identities?.length ?? 0,
    });

    if (data?.user) {
      console.log('[SignUp] User created in auth.users. Check Supabase Dashboard → Authentication → Users');
    }
    if (error) {
      console.error('[SignUp] Error:', error.message, error);
    }

    const alreadyRegistered =
      !error && !!data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;

    return {
      error,
      requiresEmailConfirmation: !error && !alreadyRegistered && !data.session,
      alreadyRegistered,
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SessionProvider');
  }
  return context;
}
