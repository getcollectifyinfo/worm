import React from 'react';
import { Gamepad2, Gauge } from 'lucide-react';

interface LandingPageProps {
  onSelectGame: (game: 'WORM' | 'IPP') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectGame }) => {
  return (
    <div className="w-full h-screen bg-[#1a1a1a] flex flex-col items-center justify-center gap-12 p-8">
      <h1 className="text-6xl font-bold text-white mb-8 tracking-wider">GAME MENU</h1>
      
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
      </div>
    </div>
  );
};
