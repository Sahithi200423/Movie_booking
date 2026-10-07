// ====================================================================
// CineBook Supabase Authentication Context
// ====================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isDemoUser: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInAsDemo: (role?: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Fetch or construct profile
  const fetchProfile = async (userId: string, email: string) => {
    try {
      if (!isSupabaseConfigured()) {
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      } else {
        // Fallback default profile
        setProfile({
          id: userId,
          email,
          full_name: email.split('@')[0],
          phone: null,
          avatar_url: null,
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Profile fetch warning:', err);
    }
  };

  useEffect(() => {
    // 1. Check for active Supabase session
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email ?? '');
        }
        setLoading(false);
      });

      // 2. Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email ?? '');
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Check for saved demo session
      const savedDemo = localStorage.getItem('cinebook_demo_session');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          setUser(parsed.user);
          setProfile(parsed.profile);
          setIsDemoUser(true);
        } catch {
          localStorage.removeItem('cinebook_demo_session');
        }
      }
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Demo authentication simulation
      signInAsDemo('customer');
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured()) {
      signInAsDemo('customer');
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'customer',
        },
      },
    });
    return { error: error as Error | null };
  };

  const signInAsDemo = (role: UserRole = 'customer') => {
    const demoId = role === 'admin' ? 'admin-0000-0000-0000-000000000001' : 'demo-0000-0000-0000-000000000001';
    const demoEmail = role === 'admin' ? 'admin@cinebook.in' : 'rahul.verma@cinebook.in';
    const demoName = role === 'admin' ? 'Cinema Super Admin' : 'Rahul Verma';

    const mockUser: User = {
      id: demoId,
      app_metadata: {},
      user_metadata: { full_name: demoName, role },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: demoEmail,
    };

    const mockProfile: Profile = {
      id: demoId,
      email: demoEmail,
      full_name: demoName,
      phone: '+91 98765 43210',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setIsDemoUser(true);
    localStorage.setItem(
      'cinebook_demo_session',
      JSON.stringify({ user: mockUser, profile: mockProfile })
    );
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsDemoUser(false);
    localStorage.removeItem('cinebook_demo_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isDemoUser,
        signInWithEmail,
        signUpWithEmail,
        signInAsDemo,
        signOut,
      }}
    >
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
