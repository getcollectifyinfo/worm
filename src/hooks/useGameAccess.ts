import { useState } from 'react';
import { useAuth } from './useAuth';
import type { DifficultyLevel } from '../types';

export type UserTier = 'GUEST' | 'FREE' | 'PRO';

export interface GameAccess {
  tier: UserTier;
  canAccessModule: (moduleId: string) => boolean;
  allowedDifficulties: DifficultyLevel[];
  maxDuration: number; // in seconds (0 for unlimited/real exam)
  maxAttempts: number; // 0 for unlimited
  isSettingsEnabled: boolean;
  canRecordStats: boolean;
  showProModal: boolean;
  openProModal: () => void;
  closeProModal: () => void;
  checkAccess: (moduleId: string, difficulty?: DifficultyLevel) => boolean;
  remainingGuestAttempts: number;
  decrementGuestAttempts: () => void;
}

const GUEST_ALLOWED_MODULES = ['cube', 'worm'];
const GUEST_MAX_ATTEMPTS = 2;
const DEMO_DURATION = 120; // 2 minutes in seconds

export const useGameAccess = (): GameAccess => {
  const { user } = useAuth();
  const [showProModal, setShowProModal] = useState(false);
  
  // TODO: Connect to real subscription data
  // For now, we assume FREE if logged in, unless we find a specific flag
  const hasSubscription = user?.app_metadata?.subscription_status === 'active';
  
  let tier: UserTier = 'GUEST';
  if (user) {
    tier = hasSubscription ? 'PRO' : 'FREE';
  }

  // Guest Attempts Logic
  const [remainingGuestAttempts, setRemainingGuestAttempts] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('guest_attempts');
      return stored ? parseInt(stored, 10) : GUEST_MAX_ATTEMPTS;
    }
    return GUEST_MAX_ATTEMPTS;
  });

  const decrementGuestAttempts = () => {
    if (tier === 'GUEST') {
      const newCount = Math.max(0, remainingGuestAttempts - 1);
      setRemainingGuestAttempts(newCount);
      localStorage.setItem('guest_attempts', newCount.toString());
    }
  };

  const canAccessModule = (moduleId: string) => {
    if (tier === 'PRO') return true;
    if (tier === 'FREE') return true;
    if (tier === 'GUEST') return GUEST_ALLOWED_MODULES.includes(moduleId);
    return false;
  };

  const allowedDifficulties: DifficultyLevel[] = 
    tier === 'PRO' 
      ? ['EASY', 'MEDIUM', 'HARD', 'EXPERT'] 
      : ['EASY'];

  const maxDuration = tier === 'PRO' ? 0 : DEMO_DURATION;
  const maxAttempts = tier === 'PRO' ? 0 : (tier === 'FREE' ? 0 : GUEST_MAX_ATTEMPTS); // Free users have unlimited attempts but short duration? "Her modül için 2 dakikalık mini deneme" implies unlimited starts but limited time per run.
  
  // Note: Guest has total 2 attempts. Free has unlimited "mini trials".

  const isSettingsEnabled = tier === 'PRO';
  const canRecordStats = tier !== 'GUEST';

  const checkAccess = (moduleId: string, difficulty?: DifficultyLevel) => {
    if (!canAccessModule(moduleId)) {
      if (tier === 'GUEST') {
        // Prompt Login
        // logic handled by UI usually
        return false; 
      }
      return false;
    }

    if (difficulty && !allowedDifficulties.includes(difficulty)) {
      setShowProModal(true);
      return false;
    }

    if (tier === 'GUEST' && remainingGuestAttempts <= 0) {
      // Guest used all attempts
      // EXCEPTION: Cube and Worm are always allowed for demo (2 mins)
      if (['cube', 'worm'].includes(moduleId)) {
        return true;
      }
      setShowProModal(true);
      return false;
    }

    return true;
  };

  return {
    tier,
    canAccessModule,
    allowedDifficulties,
    maxDuration,
    maxAttempts,
    isSettingsEnabled,
    canRecordStats,
    showProModal,
    openProModal: () => setShowProModal(true),
    closeProModal: () => setShowProModal(false),
    checkAccess,
    remainingGuestAttempts,
    decrementGuestAttempts
  };
};
