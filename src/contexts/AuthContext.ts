import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession?: () => Promise<{ data: { session: Session | null; user: User | null }, error: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
