import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useLanguage } from '../contexts/LanguageContext';
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
  closeProModal: () => void;checkAccess: (moduleId: string, difficulty?: DifficultyLevel) => boolean;
  remainingGuestAttempts: number;
  decrementGuestAttempts: () => void;
  handleUpgrade: (customSource?: string) => Promise<void>;
  showLoginGate: boolean;
  openLoginGate: () => void;
  closeLoginGate: () => void;
}

const GUEST_ALLOWED_MODULES = ['cube', 'worm', 'vigi', 'vigi1', 'ipp', 'capacity'];const GUEST_MAX_ATTEMPTS = 2;
const DEMO_DURATION = 120; // 2 minutes in seconds

export const useGameAccess = (): GameAccess => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [showProModal, setShowProModal] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  
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
  // Free users have unlimited attempts but short duration? "Her modül için 2 dakikalık mini deneme" implies unlimited starts but limited time per run.
  const maxAttempts = tier === 'PRO' ? 0 : (tier === 'FREE' ? 0 : GUEST_MAX_ATTEMPTS); 
  
  // Note: Guest has total 2 attempts. Free has unlimited "mini trials".

  const isSettingsEnabled = tier === 'PRO';
  const canRecordStats = tier !== 'GUEST';

  const checkAccess = (moduleId: string, difficulty?: DifficultyLevel) => {
    if (!canAccessModule(moduleId)) {
      // Prompt Login or Pro Modal handled by caller or here
      // But if tier is GUEST and module not allowed, canAccessModule returns false.
      if (tier === 'GUEST') {
         // Maybe open login gate here?
         // setShowLoginGate(true); 
         // But let's keep it simple.
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

  const handleUpgrade = useCallback(async (customSource?: string) => {
    if (!user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_pro_upgrade', 'true');
      }
      setShowLoginGate(true);
      return;
    }

    try {
      // Determine return URL with source parameter
      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set('source', customSource || 'menu');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: returnUrl.toString(),
          userId: user.id,
          userEmail: user.email,
          locale: language
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
        alert('Payment initialization failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Payment initialization failed. Please try again.');
    }
  }, [user, language]);

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
    decrementGuestAttempts,
    handleUpgrade,
    showLoginGate,
    openLoginGate: () => setShowLoginGate(true),
    closeLoginGate: () => setShowLoginGate(false)
  };
};
