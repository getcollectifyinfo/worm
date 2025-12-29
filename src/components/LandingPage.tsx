import React, { useState } from 'react';
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

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectGame, onSignOut, onShowStats, user }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { tier } = useGameAccess();

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
            <span className="text-gray-300 text-sm hidden sm:inline">{user.email}</span>
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
        {/* CUBE Button */}
        <button 
          onClick={() => handleGameSelect('CUBE')}
          className="group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-pink-500 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-pink-500/20"
        >
          {tier === 'GUEST' && (
            <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              Demo
            </div>
          )}
          <div className="p-4 bg-pink-500/10 rounded-xl group-hover:bg-pink-500 transition-colors duration-300">
            <Box size={40} className="text-pink-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white tracking-wider group-hover:text-pink-400">CUBE</span>
            <span className="text-sm font-medium text-gray-400 mt-1 group-hover:text-pink-300">Spatial Orientation</span>
          </div>
        </button>

        {/* WORM Button */}
        <button 
          onClick={() => handleGameSelect('WORM')}
          className="group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-green-500 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/20"
        >
          {tier === 'GUEST' && (
            <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              Demo
            </div>
          )}
          <div className="p-4 bg-green-500/10 rounded-xl group-hover:bg-green-500 transition-colors duration-300">
            <Gamepad2 size={40} className="text-green-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white tracking-wider group-hover:text-green-400">WORM</span>
            <span className="text-sm font-medium text-gray-400 mt-1 group-hover:text-green-300">Grid Orientation Test</span>
          </div>
        </button>

        {/* IPP Button */}
        <button 
          onClick={() => handleGameSelect('IPP')}
          className="group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20"
        >
          {tier === 'GUEST' && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              FREE Signup
            </div>
          )}
          <div className="p-4 bg-blue-500/10 rounded-xl group-hover:bg-blue-500 transition-colors duration-300">
            <Gauge size={40} className="text-blue-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white tracking-wider group-hover:text-blue-400">IPP</span>
            <span className="text-sm font-medium text-gray-400 mt-1 group-hover:text-blue-300">Instrument Flight Rules</span>
          </div>
        </button>

        {/* VIGI 1 Button */}
        <button 
          onClick={() => handleGameSelect('VIGI1')}
          className="group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/20"
        >
          {tier === 'GUEST' && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              FREE Signup
            </div>
          )}
          <div className="p-4 bg-orange-500/10 rounded-xl group-hover:bg-orange-500 transition-colors duration-300">
            <Eye size={40} className="text-orange-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white tracking-wider group-hover:text-orange-400">VIGI 1</span>
            <span className="text-sm font-medium text-gray-400 mt-1 group-hover:text-orange-300">Audio-Visual Vigilance</span>
          </div>
        </button>

        {/* VIGI Button */}
        <button 
          onClick={() => handleGameSelect('VIGI')}
          className="group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-purple-500 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/20"
        >
          {tier === 'GUEST' && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              FREE Signup
            </div>
          )}
          <div className="p-4 bg-purple-500/10 rounded-xl group-hover:bg-purple-500 transition-colors duration-300">
            <Zap size={40} className="text-purple-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white tracking-wider group-hover:text-purple-400">VIGI 2</span>
            <span className="text-sm font-medium text-gray-400 mt-1 group-hover:text-purple-300">Dot Vigilance Test</span>
          </div>
        </button>

        {/* CAPACITY Button */}
        <button 
          onClick={() => handleGameSelect('CAPACITY')}
          className="group relative flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-yellow-500 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-yellow-500/20"
        >
          {tier === 'GUEST' && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              FREE Signup
            </div>
          )}
          <div className="p-4 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500 transition-colors duration-300">
            <Brain size={40} className="text-yellow-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white tracking-wider group-hover:text-yellow-400">CAPACITY</span>
            <span className="text-sm font-medium text-gray-400 mt-1 group-hover:text-yellow-300">Attention Capacity</span>
          </div>
        </button>
      </div>
    </div>
  );
};
