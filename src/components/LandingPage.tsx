import React, { useState, useEffect } from 'react';
import { Gamepad2, Gauge, Zap, Brain, LogOut, LogIn, Eye, Trophy, Box } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { AuthPage } from './Auth/AuthPage';
import { useGameAccess } from '../hooks/useGameAccess';

interface LandingPageProps {
  onSelectGame: (game: 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1' | 'CUBE') => void;
  onSignOut: () => void;
  onShowStats: () => void;
  user: User | null;
}

const GAMES = [
  { 
    id: 'CUBE', 
    title: 'CUBE', 
    description: 'Spatial Orientation', 
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
    description: 'Grid Orientation Test', 
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
    description: 'Instrument Flight Rules', 
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
    description: 'Audio-Visual Vigilance', 
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
    description: 'Dot Vigilance Test', 
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
    description: 'Attention Capacity', 
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
] as const;

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectGame, onSignOut, onShowStats, user }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { tier } = useGameAccess();

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

  const handleGameSelect = (game: 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1' | 'CUBE') => {
    if (tier === 'GUEST' && !['CUBE', 'WORM'].includes(game)) {
        // Guest can only access CUBE and WORM.
        // Prompt login for others.
        localStorage.setItem('pending_game', game);
        setShowAuth(true);
        return;
    }

    if (['CUBE', 'WORM'].includes(game) || tier !== 'GUEST') {
         onSelectGame(game);
    } else {
         localStorage.setItem('pending_game', game);
         setShowAuth(true);
    }
  };

  // Badge Logic
  const getBadgeConfig = (gameId: string) => {
    // PRO User
    if (tier === 'PRO') {
        return {
            label: 'PRO',
            subtext: 'Sınırsız Kullanım',
            bgColor: 'bg-purple-600',
            textColor: 'text-white',
            icon: null
        };
    }

    // FREE User (Logged In)
    if (tier === 'FREE') {
        return {
            label: 'FREE',
            subtext: 'Mini deneme',
            bgColor: 'bg-yellow-500',
            textColor: 'text-black', // Yellow bg usually needs dark text
            icon: null
        };
    }

    // GUEST User
    if (['CUBE', 'WORM'].includes(gameId)) {
        return {
            label: 'DEMO',
            subtext: '2 dk • Kayıt gerekmez',
            bgColor: 'bg-green-600',
            textColor: 'text-white',
            icon: null
        };
    } else {
        // Guest looking at restricted games
        return {
            label: 'FREE',
            subtext: 'Mini deneme',
            bgColor: 'bg-yellow-500',
            textColor: 'text-black',
            icon: null
        };
    }
  };

  if (showAuth) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-4 left-4 z-50 text-white hover:text-gray-300"
        >
          ← Back
        </button>
        <AuthPage onSuccess={() => {
            setShowAuth(false);
            const pending = localStorage.getItem('pending_game');
            if (pending) {
                localStorage.removeItem('pending_game');
                onSelectGame(pending as 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1' | 'CUBE');
            }
        }} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#1a1a1a] flex flex-col items-center justify-center gap-12 p-8 relative">
      {user ? (
        <div className="absolute top-8 right-8 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
                <span className="text-gray-300 text-sm hidden sm:inline">{user.email}</span>
                {tier === 'PRO' && (
                    <span className="text-[10px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-full leading-none">PRO</span>
                )}
            </div>
            <span className={`text-xs transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        onShowStats();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <Trophy size={16} className="text-yellow-500" />
                    Statistics
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
                    Sign Out
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
          <span className="font-bold">Sign In</span>
        </button>
      )}

      <div className="flex flex-col items-center">
        <div className="bg-white/90 p-4 rounded-2xl mb-6 shadow-lg shadow-purple-500/20">
          <img src="/logo.png" alt="CadetPrep Academy" className="h-24 md:h-32 drop-shadow-lg" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-wider text-center">SKY TEST SIMULATION</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full px-4">
        {GAMES.map((game) => {
          const badge = getBadgeConfig(game.id);
          const Icon = game.icon;
          const colors = game.colorClasses;

          return (
            <button 
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              className={`group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg ${colors.border} ${colors.shadow}`}
            >
              {/* Standardized Badge */}
              <div className={`absolute top-4 right-4 ${badge.bgColor} ${badge.textColor} text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1.5`}>
                {badge.icon && React.createElement(badge.icon, { size: 12 })}
                {badge.label}
              </div>

              <div className={`p-4 rounded-xl transition-colors duration-300 ${colors.bg} ${colors.bgHover}`}>
                <Icon size={40} className={`transition-colors ${colors.text} group-hover:text-white`} />
              </div>
              
              <div className="flex flex-col items-center">
                <span className={`text-xl font-bold text-white tracking-wider ${colors.textHover}`}>{game.title}</span>
                <span className={`text-sm font-medium text-gray-400 mt-1 ${colors.descHover}`}>{game.description}</span>
                
                {/* Badge Subtext */}
                <div className="mt-3 text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-900/80 px-2 py-1 rounded-md">
                   {badge.subtext}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
