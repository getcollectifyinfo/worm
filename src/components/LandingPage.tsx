import React, { useState } from 'react';
import { Gamepad2, Gauge, Zap, Brain, LogOut, LogIn } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { AuthPage } from './Auth/AuthPage';

interface LandingPageProps {
  onSelectGame: (game: 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY') => void;
  onSignOut: () => void;
  user: User | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectGame, onSignOut, user }) => {
  const [showAuth, setShowAuth] = useState(false);

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
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {user.email}
          </span>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-bold">Sign Out</span>
          </button>
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
        <h1 className="text-6xl font-bold text-white mb-8 tracking-wider">Cadetprep Academy</h1>
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
          <span className="text-3xl font-bold text-white tracking-widest group-hover:text-green-400">WORM</span>
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

        {/* VIGI Button */}
        <button 
          onClick={() => onSelectGame('VIGI')}
          className="group flex flex-col items-center gap-6 p-12 bg-gray-800 rounded-2xl border-4 border-transparent hover:border-purple-500 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 shadow-xl"
        >
          <div className="p-6 bg-purple-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Zap size={64} className="text-white" />
          </div>
          <span className="text-3xl font-bold text-white tracking-widest group-hover:text-purple-400">VIGI</span>
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
