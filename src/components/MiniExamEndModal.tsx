import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface MiniExamEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void; // Trigger Stripe or Login -> Stripe
  onPractice: () => void;
}

export const MiniExamEndModal: React.FC<MiniExamEndModalProps> = ({
  isOpen,
  onUpgrade,
  onPractice
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gray-900 rounded-3xl w-full max-w-lg border border-gray-800 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="p-8 relative z-10 text-center">
            
            {/* Header */}
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                Bu, gerçek sınavın<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                    sadece başlangıcıydı.
                </span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Az önce oynadığın Mini Exam,<br/>
                gerçek sınavın en kolay ve en kısa versiyonuydu.
            </p>

            {/* Value Props */}
            <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50 text-left">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PRO</span>
                    <span className="text-white font-bold">Pro Üyelikle:</span>
                </div>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                        Daha uzun ve zor sınavlar
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                        Gerçek tempo (Medium / Hard)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                        Practice + detaylı analizler
                    </li>
                </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4">
                <button
                    onClick={onUpgrade}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] group"
                >
                    Gerçek Exam Moduna Geç (Pro)
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={onPractice}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors py-2"
                >
                    Practice ile biraz daha hazırlan.
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
