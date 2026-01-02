import React, { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mounted');
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider unmounted');
      subscription.unsubscribe();
    };
  }, []);

  // Check for new user registration and send notification
  useEffect(() => {
    if (user && user.created_at) {
      const checkNewUser = async () => {
        try {
          const createdAt = new Date(user.created_at);
          const now = new Date();
          const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
          const key = `registration_notification_sent_${user.id}`;

          // If created within last 2 minutes and not notified locally
          if (diffMinutes < 2 && !localStorage.getItem(key)) {
              // Mark as sent immediately to prevent double firing
              localStorage.setItem(key, 'true');
              
              await fetch('/api/notify-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: user.email,
                  userId: user.id,
                  provider: user.app_metadata?.provider || 'unknown'
                })
              });
          }
        } catch (err) {
          console.error('Failed to notify registration:', err);
        }
      };
      checkNewUser();
    }
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      // Use origin to ensure we redirect to the correct domain (localhost or production)
      // We avoid appending paths like /simulation because they might not be whitelisted in Supabase
      const redirectTo = window.location.origin;
      console.log('Initiating Google Login with redirect URL:', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (!session) return;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error && error.message === 'Auth session missing!') {
        // Session is already gone, just ignore
        return;
      }
      // Log as warning instead of error for network aborts (common during navigation)
      console.warn('Sign out notice:', error);
      
      // Ensure local state is cleared even if server request fails
      setSession(null);
      setUser(null);
    }
  };

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    return { data, error };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};
