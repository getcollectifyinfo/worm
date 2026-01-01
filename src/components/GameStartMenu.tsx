import React from 'react';
import { Play, Settings, ArrowLeft, Book } from 'lucide-react';
import { UserBadge } from './UserBadge';

interface GameStartMenuProps {
  title: string;
  onStart: () => void;
  onSettings?: () => void;
  onPractice?: () => void;
  practiceLabel?: string;
  isPracticeDisabled?: boolean;
  onBack: () => void;
  onLearn?: () => void;
  startLabel?: string;
  highScore?: number | string;
  children?: React.ReactNode;
  tier?: 'GUEST' | 'FREE' | 'PRO';
}

export const GameStartMenu: React.FC<GameStartMenuProps> = ({ 
  title, 
  onStart, 
  onSettings,
  onPractice, 
  practiceLabel,
  isPracticeDisabled,
  onBack,
  onLearn,
  startLabel = "EXAM MODE",
  highScore,
  children,
  tier
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full flex flex-col gap-4 animate-fade-in">
        
        <div className="flex justify-center -mb-2">
          <img src="/logo.png" alt="Logo" className="h-32 drop-shadow-lg" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
           <h1 className="text-4xl font-bold text-center text-white tracking-wider">{title}</h1>
           <UserBadge className="h-8" />
        </div>
        
        {highScore !== undefined && (
           <div className="text-center text-gray-400 -mt-4 mb-2">
             High Score: <span className="text-yellow-400 font-bold">{highScore}</span>
           </div>
        )}

        {children}

        {/* EXAM MODE */}
        <button 
          onClick={onStart}
          className="group flex flex-col items-center justify-center w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all hover:scale-105 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <Play size={28} className="fill-current" />
            <span className="text-2xl font-bold">{startLabel}</span>
          </div>
          <span className="text-green-100 text-sm font-medium mt-1">
             {tier === 'PRO' ? 'Gerçek sınav temposu ve skor' : '2 dakikalık örnek sınav (Easy)'}
          </span>
        </button>

        {/* PRACTICE MODE */}
        {onPractice && (
            <button 
            onClick={isPracticeDisabled ? undefined : onPractice}
            disabled={isPracticeDisabled}
            className={`group flex flex-col items-center justify-center w-full py-3 text-white rounded-xl transition-all shadow-lg ${
                isPracticeDisabled 
                ? 'bg-gray-600 cursor-not-allowed opacity-70' 
                : 'bg-blue-600 hover:bg-blue-500 hover:scale-105'
            }`}
            >
            <div className="flex items-center gap-3">
                <Settings size={24} />
                <span className="text-xl font-bold">{practiceLabel || "PRACTICE MODE"}</span>
            </div>
            <span className={`text-xs font-medium mt-1 ${isPracticeDisabled ? 'text-gray-300' : 'text-blue-100'}`}>
                {isPracticeDisabled ? 'Çok yakında!' : 'Alıştırmalarla refleks kazan'}
            </span>
            </button>
        )}

        {/* SETTINGS (Legacy or Config) */}
        {onSettings && !onPractice && (
          <button 
            onClick={onSettings}
            className="group flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg"
          >
            <Settings size={24} />
            SETTINGS
          </button>
        )}

        {/* LEARN MODE */}
        {onLearn && (
            <button 
            onClick={onLearn}
            className="group flex flex-col items-center justify-center w-full py-3 bg-[#6d28d9] hover:bg-[#5b21b6] text-white rounded-xl transition-all hover:scale-105 shadow-lg"
            >
            <div className="flex items-center gap-3">
                <Book size={24} />
                <span className="text-xl font-bold">LEARN MODE</span>
            </div>
            <span className="text-purple-100 text-xs font-medium mt-1">Mantığını kısa ve net öğren</span>
            </button>
        )}

        <div className="h-px bg-gray-700 my-2" />

        <button 
          onClick={onBack}
          className="group flex items-center justify-center gap-3 w-full py-3 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
          BACK TO MENU
        </button>
      </div>
    </div>
  );
};
