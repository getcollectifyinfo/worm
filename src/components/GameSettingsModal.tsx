import React, { type ReactNode } from 'react';

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  title = "Game Settings",
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close settings"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        
        <div className="space-y-6">
          {children}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Common UI components for settings to ensure consistency
export const SettingsSection: React.FC<{ title?: string; children: ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    {title && <h3 className="text-gray-700 font-semibold mb-3">{title}</h3>}
    {children}
  </div>
);

export const SettingsLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <label className="block text-sm text-gray-500 mb-1 font-medium">{children}</label>
);

export const SettingsRange: React.FC<{
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  valueLabel?: ReactNode;
}> = ({ value, min, max, step = 1, onChange, leftLabel, rightLabel, valueLabel }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-700 font-medium">
        {valueLabel !== undefined ? valueLabel : value}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-700 transition-all"
    />
    {(leftLabel || rightLabel) && (
      <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    )}
  </div>
);
