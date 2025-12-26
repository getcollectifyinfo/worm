import React, { useState } from 'react';
import { Gamepad2, Gauge, Zap, Brain, LogOut, LogIn, Eye, Trophy } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { AuthPage } from './Auth/AuthPage';

interface LandingPageProps {
  onSelectGame: (game: 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1') => void;
  onSignOut: () => void;
  onShowStats: () => void;
  user: User | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectGame, onSignOut, onShowStats, user }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (showAuth) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-4 left-4 z-50 text-white hover:text-gray-300"
        >
          ← Back
        </button>
        <AuthPage onSuccess={() => setShowAuth(false)} />
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
        <img src="/logo.png" alt="CadetPrep Academy" className="h-64 mb-6 drop-shadow-2xl" />
        <h1 className="text-6xl font-bold text-white mb-8 tracking-wider">SKY TEST SIMULATION</h1>
      </div>
      
      <div className="flex gap-16">
        {/* WORM Button */}
        <button 
          onClick={() => onSelectGame('WORM')}
          className="group flex flex-col items-center gap-6 p-12 bg-gray-800 rounded-2xl border-4 border-transparent hover:border-green-500 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 shadow-xl"
        >
          <div className="p-6 bg-green-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Gamepad2 size={64} className="text-white" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white tracking-widest group-hover:text-green-400">WORM</span>
            <span className="text-sm font-medium text-gray-400 mt-2 group-hover:text-green-300">Grid Orientation Test</span>
          </div>
        </button>

        {/* IPP Button */}
        <button 
          onClick={() => onSelectGame('IPP')}
          className="group flex flex-col items-center gap-6 p-12 bg-gray-800 rounded-2xl border-4 border-transparent hover:border-blue-500 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 shadow-xl"
        >
          <div className="p-6 bg-blue-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Gauge size={64} className="text-white" />
          </div>
          <span className="text-3xl font-bold text-white tracking-widest group-hover:text-blue-400">IPP</span>
        </button>

        {/* VIGI 1 Button */}
        <button 
          onClick={() => onSelectGame('VIGI1')}
          className="group flex flex-col items-center gap-6 p-12 bg-gray-800 rounded-2xl border-4 border-transparent hover:border-orange-500 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 shadow-xl"
        >
          <div className="p-6 bg-orange-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Eye size={64} className="text-white" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white tracking-widest group-hover:text-orange-400">VIGI 1</span>
            <span className="text-sm font-medium text-gray-400 mt-2 group-hover:text-orange-300">Audio-Visual Vigilance</span>
          </div>
        </button>

        {/* VIGI Button */}
        <button 
          onClick={() => onSelectGame('VIGI')}
          className="group flex flex-col items-center gap-6 p-12 bg-gray-800 rounded-2xl border-4 border-transparent hover:border-purple-500 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 shadow-xl"
        >
          <div className="p-6 bg-purple-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Zap size={64} className="text-white" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white tracking-widest group-hover:text-purple-400">VIGI 2</span>
            <span className="text-sm font-medium text-gray-400 mt-2 group-hover:text-purple-300">Dot Vigilance Test</span>
          </div>
        </button>

        {/* CAPACITY Button */}
        <button 
          onClick={() => onSelectGame('CAPACITY')}
          className="group flex flex-col items-center gap-6 p-12 bg-gray-800 rounded-2xl border-4 border-transparent hover:border-yellow-500 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 shadow-xl"
        >
          <div className="p-6 bg-yellow-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Brain size={64} className="text-white" />
          </div>
          <span className="text-3xl font-bold text-white tracking-widest group-hover:text-yellow-400">CAPACITY</span>
        </button>
      </div>
    </div>
  );
};
