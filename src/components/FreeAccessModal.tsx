import React from 'react';
import { X, Unlock, ArrowRight, Mail } from 'lucide-react';

interface FreeAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onGoogleLogin: () => void;
}

export const FreeAccessModal: React.FC<FreeAccessModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin,
  onGoogleLogin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-green-500/30 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header Content */}
        <div className="relative p-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-600/10 to-transparent pointer-events-none" />
          
          <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25 rotate-3">
            <Unlock size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Bu oyun ücretsiz üyelikle açılıyor</h2>
          <p className="text-slate-300">
            Ücretsiz hesabınla bu simülasyonu deneyebilirsin.
            <br />
            <span className="text-slate-400 text-sm mt-2 block">Kredi kartı gerekmez.</span>
          </p>
        </div>

        {/* CTA Section */}
        <div className="px-8 pb-8">
          <button 
            onClick={onGoogleLogin}
            className="w-full py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Google ile Ücretsiz Devam Et
            <ArrowRight size={20} className="text-gray-600" />
          </button>

          <button 
            onClick={onLogin}
            className="w-full mt-3 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-slate-700"
          >
            <Mail size={20} className="text-slate-300" />
            E-posta ile Devam Et
            <ArrowRight size={20} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
