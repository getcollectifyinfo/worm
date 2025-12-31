import React from 'react';
import { RotateCcw, Home, Award } from 'lucide-react';
import { UserBadge } from './UserBadge';

interface GameResultsModalProps {
  isOpen: boolean;
  score: number | string;
  duration: string;
  onRetry: () => void;
  onExit: () => void;
  title?: string;
  children?: React.ReactNode;
  tier?: 'GUEST' | 'FREE' | 'PRO';
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  isOpen,
  score,
  duration,
  onRetry,
  onExit,
  title = "SESSION COMPLETE",
  children,
  tier
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-[100] animate-fade-in">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full flex flex-col gap-6 text-center">
        
        <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-bold text-white tracking-wider">{title}</h2>
            <UserBadge />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-gray-700/50 p-4 rounded-xl border border-gray-600">
            <div className="flex flex-col">
                <span className="text-gray-400 text-sm uppercase">Score</span>
                <span className="text-4xl font-bold text-yellow-400">{score}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-gray-400 text-sm uppercase">Duration</span>
                <span className="text-4xl font-bold text-blue-400">{duration}</span>
            </div>
        </div>

        {/* Dynamic Content (Stats / Report Card) */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-gray-300 border-b border-gray-700 pb-2 mb-2">
                <Award size={20} className="text-purple-400" />
                <span className="font-bold uppercase tracking-wide">Report Card</span>
            </div>
            <div className="text-gray-300 text-sm space-y-2">
                {children}
            </div>
            {tier !== 'PRO' && (
                <div className="text-xs text-gray-500 mt-4 italic border-t border-gray-700 pt-2">
                    Upgrade to PRO for detailed performance analysis and progress tracking.
                </div>
            )}
        </div>

        <div className="flex gap-4 mt-2">
            <button 
                onClick={onExit}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
                <Home size={20} />
                MENU
            </button>
            <button 
                onClick={onRetry}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
                <RotateCcw size={20} />
                RETRY
            </button>
        </div>

      </div>
    </div>
  );
};
