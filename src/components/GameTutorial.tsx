import React from 'react';
import { X, Keyboard, ScrollText, Gamepad2 } from 'lucide-react';

interface ControlItem {
  key: string;
  action: string;
  icon?: React.ReactNode;
}

interface I18nContent {
  title?: string;
  description?: string;
  rules?: string[];
  controls?: ControlItem[];
  ctaText?: string;
  secondaryCtaText?: string;
}

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  rules?: string[];
  controls?: ControlItem[];
  children?: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  isSecondaryCtaDisabled?: boolean;
  hideTitleSuffix?: boolean;
  translations?: {
    en?: I18nContent;
    tr?: I18nContent;
  };
  initialLocale?: 'en' | 'tr';
  locale?: 'en' | 'tr';
  onLocaleChange?: (locale: 'en' | 'tr') => void;
}

export const GameTutorial: React.FC<GameTutorialProps> = ({
  isOpen,
  onClose,
  title,
  description,
  rules,
  controls,
  children,
  ctaText = "GOT IT!",
  onCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick,
  isSecondaryCtaDisabled,
  hideTitleSuffix = false,
  translations,
  initialLocale = 'en',
  locale,
  onLocaleChange,
}) => {
  const [localeState, setLocaleState] = React.useState<'en' | 'tr'>(initialLocale);
  const effectiveLocale = locale ?? localeState;
  const t = translations && translations[effectiveLocale] ? translations[effectiveLocale] : undefined;
  const resolvedTitle = t?.title ?? title;
  const resolvedDescription = t?.description ?? description;
  const resolvedRules = t?.rules ?? rules;
  const resolvedControls = t?.controls ?? controls;
  const resolvedCtaText = t?.ctaText ?? ctaText;
  const resolvedSecondaryCtaText = t?.secondaryCtaText ?? secondaryCtaText;

  if (!isOpen) return null;

  const handleCtaClick = onCtaClick || onClose;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-blue-400" size={32} />
            <h2 className="text-3xl font-bold text-white tracking-wide">
              {resolvedTitle}{!hideTitleSuffix && " TUTORIAL"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-700 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => (onLocaleChange ? onLocaleChange('tr') : setLocaleState('tr'))}
                className={`px-3 py-1 rounded-md text-sm font-bold ${effectiveLocale === 'tr' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
              >
                TR
              </button>
              <button
                onClick={() => (onLocaleChange ? onLocaleChange('en') : setLocaleState('en'))}
                className={`px-3 py-1 rounded-md text-sm font-bold ${effectiveLocale === 'en' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
              >
                EN
              </button>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {children ? (
            children
          ) : (
            <>
              {/* Description */}
              {resolvedDescription && (
                <div className="text-gray-300 text-lg leading-relaxed border-l-4 border-blue-500 pl-4 bg-gray-800/50">
                  {resolvedDescription}
                </div>
              )}

              {/* Controls Section */}
              {resolvedControls && resolvedControls.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-blue-400">
                    <Keyboard size={24} />
                    <h3 className="text-xl font-bold uppercase tracking-wider">Controls</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resolvedControls.map((control, idx) => (
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
              )}

              {/* Rules Section */}
              {resolvedRules && resolvedRules.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-green-400">
                    <ScrollText size={24} />
                    <h3 className="text-xl font-bold uppercase tracking-wider">Rules & Objectives</h3>
                  </div>
                  <ul className="space-y-3">
                    {resolvedRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300 bg-gray-700/30 p-3 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end bg-gray-800 rounded-b-2xl gap-3">
          {resolvedSecondaryCtaText && (
            <button 
                onClick={isSecondaryCtaDisabled ? undefined : onSecondaryCtaClick}
                disabled={isSecondaryCtaDisabled}
                className={`px-6 py-3 text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 ${
                    isSecondaryCtaDisabled 
                    ? 'bg-gray-600 cursor-not-allowed opacity-70' 
                    : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                }`}
            >
                {resolvedSecondaryCtaText}
            </button>
          )}
          <button 
            onClick={handleCtaClick}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg flex items-center gap-2"
          >
            {resolvedCtaText}
          </button>
        </div>
      </div>
    </div>
  );
};
