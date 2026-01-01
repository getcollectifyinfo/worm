import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGameAccess } from '../hooks/useGameAccess';
import { useAuth } from '../hooks/useAuth';
import { Check, Crown, Loader2, RefreshCw } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface SubscriptionSuccessProps {
  onClose: () => void;
}

export const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { tier } = useGameAccess();
  const { refreshSession } = useAuth();
  const { width, height } = useWindowSize();
  
  const [retryCount, setRetryCount] = useState(0);

  // Poll for status update if not PRO yet
  useEffect(() => {
    if (tier === 'PRO') {
      return;
    }

    const interval = setInterval(async () => {
      if (retryCount > 10) { // Stop auto-polling after ~20 seconds
        clearInterval(interval);
        return;
      }
      
      console.log('Polling for subscription status update...');
      if (refreshSession) {
        await refreshSession();
      }
      setRetryCount(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [tier, refreshSession, retryCount]);

  const handleManualRefresh = async () => {
    if (refreshSession) {
      await refreshSession();
    }
  };

  const benefits = [
    t('success_benefit_1'),
    t('success_benefit_2'),
    t('success_benefit_3'),
    t('success_benefit_4')
  ];

  if (tier !== 'PRO') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('verifying_status')}</h2>
          <p className="text-slate-400 mb-8">{t('processing')}</p>
          
          <button 
            onClick={handleManualRefresh}
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium border border-slate-700"
          >
            <RefreshCw size={18} />
            {t('success_refresh_button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
      
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-yellow-500/30 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30 animate-in zoom-in duration-500">
                <Crown className="text-white w-10 h-10" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
                {t('success_pro_title')}
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
                {t('success_pro_desc')}
            </p>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left border border-white/10">
                <h3 className="text-yellow-400 font-semibold mb-4 text-sm uppercase tracking-wider">
                    {t('success_pro_benefits_title')}
                </h3>
                <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-200">
                            <div className="mt-1 bg-green-500/20 p-1 rounded-full shrink-0">
                                <Check size={14} className="text-green-400" />
                            </div>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button 
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-900/20 transition-all transform hover:scale-[1.02] text-lg"
            >
                {t('success_continue_button')}
            </button>
        </div>
      </div>
    </div>
  );
};
