import React from 'react';
import { Play, Settings, ArrowLeft, HelpCircle } from 'lucide-react';

interface GameStartMenuProps {
  title: string;
  onStart: () => void;
  onSettings: () => void;
  onBack: () => void;
  onTutorial?: () => void;
  startLabel?: string;
  highScore?: number | string;
}

export const GameStartMenu: React.FC<GameStartMenuProps> = ({ 
  title, 
  onStart, 
  onSettings, 
  onBack,
  onTutorial,
  startLabel = "START GAME",
  highScore
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full flex flex-col gap-6 animate-fade-in">
        
        {onTutorial && (
          <button 
            onClick={onTutorial}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all"
            title="How to Play"
          >
            <HelpCircle size={24} />
          </button>
        )}

        <div className="flex justify-center -mb-2">
          <img src="/logo.png" alt="Logo" className="h-40 drop-shadow-lg" />
        </div>

        <h1 className="text-4xl font-bold text-center text-white mb-2 tracking-wider">{title}</h1>
        
        {highScore !== undefined && (
           <div className="text-center text-gray-400 -mt-4 mb-2">
             High Score: <span className="text-yellow-400 font-bold">{highScore}</span>
           </div>
        )}

        <button 
          onClick={onStart}
          className="group flex items-center justify-center gap-3 w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg"
        >
          <Play size={24} className="fill-current" />
          {startLabel}
        </button>

        <button 
          onClick={onSettings}
          className="group flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg"
        >
          <Settings size={24} />
          SETTINGS
        </button>

        <div className="h-px bg-gray-700 my-2" />

        <button 
          onClick={onBack}
          className="group flex items-center justify-center gap-3 w-full py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-xl font-bold text-lg transition-all hover:scale-105"
        >
          <ArrowLeft size={20} />
          BACK TO MENU
        </button>
      </div>
    </div>
  );
};
