import React from 'react';
import { X, Gauge, Layers, Play, Lock } from 'lucide-react';
import { Settings as SettingsIcon } from 'lucide-react';

interface CubeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'GUEST' | 'FREE' | 'PRO';
  commandSpeed: number;
  commandCount: number;
  onSave: (speed: number, count: number) => void;
  onOpenProModal: () => void;
  onStart?: () => void;
}

export const CubeSettingsModal: React.FC<CubeSettingsModalProps> = ({
  isOpen,
  onClose,
  tier,
  commandSpeed,
  commandCount,
  onSave,
  onOpenProModal,
  onStart
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
          
          {/* Speed Setting */}
          <div className={`space-y-3 ${!isPro ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
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
          <div className={`space-y-3 ${!isPro ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
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

          {/* CTA for Non-Pro */}
          {!isPro && (
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-4 text-center mt-4">
              <div className="flex items-center justify-center mb-2 gap-2">
                 <Lock size={16} className="text-blue-400" />
                 <h3 className="text-white font-bold text-sm">Özelleştirme Kilitli</h3>
              </div>
              <p className="text-gray-400 text-xs mb-3">
                Kendi hızınızı ve zorluk seviyenizi belirlemek için PRO pakete geçin.
              </p>
              <button 
                onClick={onOpenProModal}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02]"
              >
                PRO'ya Yükselt
              </button>
            </div>
          )}
        </div>

        {/* Footer with Start Button */}
        {onStart && (
            <div className="p-6 border-t border-gray-700 bg-gray-800/50">
                <button
                    onClick={onStart}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                    <Play size={24} className="fill-current" />
                    BAŞLA
                </button>
            </div>
        )}

      </div>
    </div>
  );
};
