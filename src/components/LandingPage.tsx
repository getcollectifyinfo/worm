import React, { useState, useEffect } from 'react';
import { Gamepad2, Gauge, Zap, Brain, LogOut, LogIn, Eye, Trophy, Box, Plane, Home } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { AuthPage } from './Auth/AuthPage';
import { useGameAccess } from '../hooks/useGameAccess';
import { useAuth } from '../hooks/useAuth';
import { UserBadge } from './UserBadge';
import { FreeAccessModal } from './FreeAccessModal';
import type { TranslationKey } from '../i18n/translations';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface LandingPageProps {
  onSelectGame: (game: 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1' | 'CUBE' | 'CAP') => void;
  onSignOut: () => void;
  onShowStats: () => void;
  user: User | null;
  onGoHome: () => void;
  onOpenProfile: () => void;
}

const GAMES = [
  { 
    id: 'CUBE', 
    title: 'CUBE', 
    descKey: 'game_cube_desc', 
    icon: Box, 
    color: 'pink',
    colorClasses: {
      border: 'hover:border-pink-500',
      shadow: 'hover:shadow-pink-500/20',
      bg: 'bg-pink-500/10',
      bgHover: 'group-hover:bg-pink-500',
      text: 'text-pink-500',
      textHover: 'group-hover:text-pink-400',
      descHover: 'group-hover:text-pink-300'
    }
  },
  { 
    id: 'WORM', 
    title: 'WORM', 
    descKey: 'game_worm_desc', 
    icon: Gamepad2, 
    color: 'green',
    colorClasses: {
      border: 'hover:border-green-500',
      shadow: 'hover:shadow-green-500/20',
      bg: 'bg-green-500/10',
      bgHover: 'group-hover:bg-green-500',
      text: 'text-green-500',
      textHover: 'group-hover:text-green-400',
      descHover: 'group-hover:text-green-300'
    }
  },
  { 
    id: 'IPP', 
    title: 'IPP', 
    descKey: 'game_ipp_desc', 
    icon: Gauge, 
    color: 'blue',
    colorClasses: {
      border: 'hover:border-blue-500',
      shadow: 'hover:shadow-blue-500/20',
      bg: 'bg-blue-500/10',
      bgHover: 'group-hover:bg-blue-500',
      text: 'text-blue-500',
      textHover: 'group-hover:text-blue-400',
      descHover: 'group-hover:text-blue-300'
    }
  },
  { 
    id: 'VIGI1', 
    title: 'VIGI 1', 
    descKey: 'game_vigi1_desc', 
    icon: Eye, 
    color: 'orange',
    colorClasses: {
      border: 'hover:border-orange-500',
      shadow: 'hover:shadow-orange-500/20',
      bg: 'bg-orange-500/10',
      bgHover: 'group-hover:bg-orange-500',
      text: 'text-orange-500',
      textHover: 'group-hover:text-orange-400',
      descHover: 'group-hover:text-orange-300'
    }
  },
  { 
    id: 'VIGI', 
    title: 'VIGI 2', 
    descKey: 'game_vigi2_desc', 
    icon: Zap, 
    color: 'purple',
    colorClasses: {
      border: 'hover:border-purple-500',
      shadow: 'hover:shadow-purple-500/20',
      bg: 'bg-purple-500/10',
      bgHover: 'group-hover:bg-purple-500',
      text: 'text-purple-500',
      textHover: 'group-hover:text-purple-400',
      descHover: 'group-hover:text-purple-300'
    }
  },
  { 
    id: 'CAPACITY', 
    title: 'CAPACITY', 
    descKey: 'game_capacity_desc', 
    icon: Brain, 
    color: 'yellow',
    colorClasses: {
      border: 'hover:border-yellow-500',
      shadow: 'hover:shadow-yellow-500/20',
      bg: 'bg-yellow-500/10',
      bgHover: 'group-hover:bg-yellow-500',
      text: 'text-yellow-500',
      textHover: 'group-hover:text-yellow-400',
      descHover: 'group-hover:text-yellow-300'
    }
  },
  { 
    id: 'CAP', 
    title: 'Flight Capacity (CAP)', 
    descKey: 'game_cap_desc', 
    icon: Plane, 
    color: 'sky',
    colorClasses: {
      border: 'hover:border-sky-500',
      shadow: 'hover:shadow-sky-500/20',
      bg: 'bg-sky-500/10',
      bgHover: 'group-hover:bg-sky-500',
      text: 'text-sky-500',
      textHover: 'group-hover:text-sky-400',
      descHover: 'group-hover:text-sky-300'
    }
  },
] as const;

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectGame, onSignOut, onShowStats, user, onGoHome, onOpenProfile }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [showFreeAccessModal, setShowFreeAccessModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { tier } = useGameAccess();
  const { signInWithGoogle } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('login') === 'true') {
            setTimeout(() => {
                setShowAuth(true);
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }, 0);
        }
    }
  }, []);

  const handleGameSelect = (game: 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1' | 'CUBE' | 'CAP') => {
    if (game === 'CAP') return;

    if (tier === 'GUEST' && !['CUBE', 'WORM'].includes(game)) {
        // Guest can only access CUBE and WORM.
        // Prompt login for others via Free Access Modal
        localStorage.setItem('pending_game', game);
        setShowFreeAccessModal(true);
        return;
    }

    if (['CUBE', 'WORM'].includes(game) || tier !== 'GUEST') {
         onSelectGame(game);
    } else {
         localStorage.setItem('pending_game', game);
         setShowFreeAccessModal(true);
    }
  };

  // Badge Logic
  interface BadgeConfig {
    label: string;
    subtext: string;
    microText?: string;
    bgColor: string;
    textColor: string;
    icon: null;
  }

  const getBadgeConfig = (gameId: string): BadgeConfig => {
    if (gameId === 'CAP') {
        return {
            label: t('badge_soon'),
            subtext: t('badge_soon_sub'),
            bgColor: 'bg-slate-700',
            textColor: 'text-slate-400',
            icon: null
        };
    }

    // PRO User
    if (tier === 'PRO') {
        return {
            label: 'PRO',
            subtext: t('badge_pro_sub'),
            bgColor: 'bg-purple-600',
            textColor: 'text-white',
            icon: null
        };
    }

    // FREE User (Logged In)
    if (tier === 'FREE') {
        return {
            label: 'FREE',
            subtext: t('badge_free_sub'),
            bgColor: 'bg-yellow-500',
            textColor: 'text-black', // Yellow bg usually needs dark text
            icon: null
        };
    }

    // GUEST User
    if (['CUBE', 'WORM'].includes(gameId)) {
        return {
            label: 'DEMO',
            subtext: t('badge_demo_sub'),
            bgColor: 'bg-green-600',
            textColor: 'text-white',
            icon: null
        };
    } else {
        // Guest looking at restricted games
        return {
            label: 'FREE',
            subtext: t('badge_free_restricted_sub'),
            microText: t('badge_free_restricted_micro'),
            bgColor: 'bg-yellow-500',
            textColor: 'text-black',
            icon: null
        };
    }
  };

  const renderGameCard = (game: typeof GAMES[number]) => {
      const badge = getBadgeConfig(game.id);
      const Icon = game.icon;
      const colors = game.colorClasses;
      const isComingSoon = game.id === 'CAP';

      return (
        <button 
          key={game.id}
          onClick={() => handleGameSelect(game.id)}
          disabled={isComingSoon}
          className={`group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 transition-all duration-300 transform ${!isComingSoon ? 'hover:-translate-y-1 shadow-lg cursor-pointer' : 'cursor-default opacity-70'} ${!isComingSoon ? colors.border : 'border-gray-700'} ${!isComingSoon ? colors.shadow : ''}`}
        >
          {/* Standardized Badge */}
          <div className="absolute top-4 right-4 z-10">
            <UserBadge className="h-8" />
          </div>

          <div className={`p-4 rounded-xl transition-colors duration-300 ${!isComingSoon ? colors.bg : 'bg-gray-700'} ${!isComingSoon ? colors.bgHover : ''}`}>
            <Icon size={40} className={`transition-colors ${!isComingSoon ? colors.text : 'text-gray-500'} ${!isComingSoon ? 'group-hover:text-white' : ''}`} />
          </div>
          
          <div className="flex flex-col items-center">
            <span className={`text-xl font-bold text-white tracking-wider ${!isComingSoon ? colors.textHover : 'text-gray-400'}`}>{game.title}</span>
            <span className={`text-sm font-medium text-gray-400 mt-1 ${!isComingSoon ? colors.descHover : ''}`}>{t(game.descKey as TranslationKey)}</span>
            
            {/* Badge Subtext */}
            <div className="mt-3 text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-900/80 px-2 py-1 rounded-md flex flex-col items-center text-center">
               <span className={isComingSoon ? 'text-yellow-500' : ''}>{badge.subtext}</span>
               {badge.microText && (
                    <span className="text-[9px] normal-case text-gray-400 mt-1 border-t border-gray-700/50 pt-1 opacity-90 w-full">
                        {badge.microText}
                    </span>
               )}
            </div>
          </div>
        </button>
      );
  };

  if (showAuth) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-4 left-4 z-50 text-white hover:text-gray-300"
        >
          ← {t('back')}
        </button>
        <AuthPage onSuccess={() => {
            setShowAuth(false);
            const pending = localStorage.getItem('pending_game');
            if (pending) {
                localStorage.removeItem('pending_game');
                onSelectGame(pending as 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1' | 'CUBE' | 'CAP');
            }
        }} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#1a1a1a] flex flex-col items-center justify-center gap-12 p-8 relative">
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
        >
          <Home size={20} />
          <span className="font-bold">{t('home')}</span>
        </button>
        <LanguageToggle />
      </div>

      {user ? (
        <div className="absolute top-8 right-8 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <UserBadge className="h-8 w-auto" />
            <div className="flex flex-col items-start">
              <span className="text-gray-300 text-sm hidden sm:inline">{user.email}</span>
            </div>
            <span className={`text-xs transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        onOpenProfile();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <UserBadge className="h-4 w-4" />
                    {t('profile')}
                </button>
                <div className="h-px bg-gray-700" />
                <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        onShowStats();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <Trophy size={16} className="text-yellow-500" />
                    {t('statistics')}
                </button>
                <div className="h-px bg-gray-700" />
                <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        onSignOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-900/20 transition-colors"
                >
                    <LogOut size={16} />
                    {t('signOut')}
                </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowAuth(true)}
          className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          <LogIn size={20} />
          <span className="font-bold">{t('signIn')}</span>
        </button>
      )}

      <div className="flex flex-row items-center gap-6 mb-8">
        <div className="bg-white/90 p-3 rounded-xl shadow-lg shadow-purple-500/20">
          <img src="/logo.png" alt="CadetPrep Academy" className="h-12 drop-shadow-lg" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider text-center">SKY TEST SIMULATION</h1>
      </div>
      
      <div className="w-full max-w-[90rem] px-4 flex flex-col items-center gap-6">
          {/* Top Row: 3 Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {GAMES.slice(0, 3).map(renderGameCard)}
          </div>

          {/* Bottom Row: 4 Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[80rem]">
            {GAMES.slice(3, 7).map(renderGameCard)}
          </div>
      </div>

      <FreeAccessModal 
        isOpen={showFreeAccessModal}
        onClose={() => setShowFreeAccessModal(false)}
        onLogin={() => {
            setShowFreeAccessModal(false);
            setShowAuth(true);
        }}
        onGoogleLogin={() => {
            setShowFreeAccessModal(false);
            signInWithGoogle();
        }}
      />
    </div>
  );
};
