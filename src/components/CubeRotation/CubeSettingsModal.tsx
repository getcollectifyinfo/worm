import React from 'react';
import { X, Lock, Zap, Gauge, Layers } from 'lucide-react';

interface CubeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'GUEST' | 'FREE' | 'PRO';
  commandSpeed: number;
  commandCount: number;
  onSave: (speed: number, count: number) => void;
  onOpenProModal: () => void;
}

export const CubeSettingsModal: React.FC<CubeSettingsModalProps> = ({
  isOpen,
  onClose,
  tier,
  commandSpeed,
  commandCount,
  onSave,
  onOpenProModal
}) => {
  if (!isOpen) return null;

  const isPro = tier === 'PRO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="text-blue-400" />
            Oyun Ayarları
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 relative">
          
          {/* Overlay for Non-Pro */}
          {!isPro && (
             <div className="absolute inset-0 z-10 bg-gray-900/10" /> 
          )}

          {/* Speed Setting */}
          <div className={`space-y-3 ${!isPro ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Gauge size={16} className="text-blue-400" />
                    Komut Hızı
                </label>
                <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded">
                    {commandSpeed}ms
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {[2000, 1500, 1000].map((speed) => (
                    <button
                        key={speed}
                        disabled={!isPro}
                        onClick={() => onSave(speed, commandCount)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                            commandSpeed === speed 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30' 
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {speed === 2000 ? 'Yavaş' : speed === 1500 ? 'Normal' : 'Hızlı'}
                    </button>
                ))}
            </div>
          </div>

          {/* Command Count Setting */}
          <div className={`space-y-3 ${!isPro ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
             <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Layers size={16} className="text-purple-400" />
                    Komut Sayısı
                </label>
                <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded">
                    {commandCount} Adet
                </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 6].map((count) => (
                    <button
                        key={count}
                        disabled={!isPro}
                        onClick={() => onSave(commandSpeed, count)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                            commandCount === count
                            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30' 
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {count}
                    </button>
                ))}
            </div>
          </div>

        </div>

        {/* Footer / CTA */}
        <div className="p-6 bg-gray-900/50 border-t border-gray-700">
            {!isPro ? (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm text-gray-400 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                        <Lock size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                        <p>
                            <span className="text-yellow-200 font-bold block mb-1">Özelleştirme Kısıtlı</span>
                            Hız ve komut sayısı ayarları sadece PRO üyelikte değiştirilebilir. Gerçek sınav koşullarını simüle etmek için yükseltin.
                        </p>
                    </div>
                    
                    <button
                        onClick={() => {
                            onClose();
                            onOpenProModal();
                        }}
                        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <Zap size={20} />
                        Pro'ya Geç ve Ayarları Aç
                    </button>
                </div>
            ) : (
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
                >
                    Kapat
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

// Internal Icon Component to avoid import errors if Lucide icon name changed
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
);
