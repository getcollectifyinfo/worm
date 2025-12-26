import React from 'react';
import { X, Keyboard, ScrollText, Gamepad2 } from 'lucide-react';

interface ControlItem {
  key: string;
  action: string;
  icon?: React.ReactNode;
}

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  rules: string[];
  controls: ControlItem[];
}

export const GameTutorial: React.FC<GameTutorialProps> = ({
  isOpen,
  onClose,
  title,
  description,
  rules,
  controls,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-blue-400" size={32} />
            <h2 className="text-3xl font-bold text-white tracking-wide">{title} TUTORIAL</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          <div className="text-gray-300 text-lg leading-relaxed border-l-4 border-blue-500 pl-4 bg-gray-800/50">
            {description}
          </div>

          {/* Controls Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Keyboard size={24} />
              <h3 className="text-xl font-bold uppercase tracking-wider">Controls</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {controls.map((control, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-700/50 p-4 rounded-xl border border-gray-700">
                  <span className="text-gray-200 font-medium">{control.action}</span>
                  <div className="flex items-center gap-2">
                    {control.icon}
                    <kbd className="px-3 py-1.5 bg-gray-800 rounded-lg text-white font-mono text-sm shadow-md border-b-2 border-gray-900 min-w-[40px] text-center">
                      {control.key}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-green-400">
              <ScrollText size={24} />
              <h3 className="text-xl font-bold uppercase tracking-wider">Rules & Objectives</h3>
            </div>
            <ul className="space-y-3">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300 bg-gray-700/30 p-3 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end bg-gray-800 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};
