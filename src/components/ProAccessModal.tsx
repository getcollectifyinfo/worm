import React from 'react';
import { X, Crown, Check, ArrowRight } from 'lucide-react';
import { UserBadge } from './UserBadge';
import { useGameAccess } from '../hooks/useGameAccess';

interface ProAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title?: string;
  description?: React.ReactNode;
  ctaText?: string;
  trustText?: string;
  benefits?: string[];
  variant?: 'default' | 'exam-settings' | 'mini-exam-end';
}

export const ProAccessModal: React.FC<ProAccessModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade,
  title,
  description,
  ctaText,
  trustText,
  benefits,
  variant = 'default'
}) => {
  const { tier } = useGameAccess();

  // If user is already PRO, never show this modal (safety guard)
  if (tier === 'PRO') return null;
  
  if (!isOpen) return null;

  const isSettingsVariant = variant === 'exam-settings';
  const isMiniExamVariant = variant === 'mini-exam-end';
  
  const defaultTitle = isMiniExamVariant ? "Süreniz Doldu" : "Pro Üyelik Gerekli";
  const defaultDesc = isMiniExamVariant 
    ? <span className="text-yellow-400 font-bold block mt-2 text-lg">500 TL / Ay</span> 
    : "Seçtiğiniz özellik sadece Pro üyeler içindir.";
  
  const defaultCta = "Pro'ya Geç";
  const defaultTrust = "İstediğiniz zaman iptal edebilirsiniz.";
  
  let defaultBenefits = [
    "Tüm zorluk seviyeleri (Medium, Hard, Expert)",
    "Gerçek sınav süreleri ve sınırsız tekrar",
    "Detaylı performans analizi ve gelişim takibi",
    "Tüm eğitim modüllerine tam erişim"
  ];

  if (isMiniExamVariant) {
    defaultBenefits = [
        "Ayarlanabilir soru ve süre seçenekleri",
        "Gerçek sınav ortamına en yakın Exam Mode",
        "Tüm modüllere (Cube, Snake, vb.) sınırsız erişim",
        "Detaylı istatistikler ve karne sistemi"
    ];
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header Content */}
        <div className="relative p-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
          
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 rotate-3">
            <Crown size={32} className="text-white" />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white">{title || defaultTitle}</h2>
            <UserBadge className="h-8" />
          </div>
          <div className="text-slate-400">
            {description || defaultDesc}
          </div>
        </div>

        {/* Benefits List - Only show if not settings variant or if explicitly passed OR if mini-exam variant */}
        <div className="px-8 pb-8 space-y-4">
          {(!isSettingsVariant || benefits || isMiniExamVariant) && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <ul className="space-y-3">
                {(benefits || defaultBenefits).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                    <div className="mt-0.5 p-0.5 bg-green-500/20 rounded-full">
                      <Check size={12} className="text-green-400" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button 
            onClick={onUpgrade}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {ctaText || defaultCta}
            <ArrowRight size={20} />
          </button>
          
          <p className="text-center text-xs text-slate-500">
            {trustText || defaultTrust}
          </p>
        </div>
      </div>
    </div>
  );
};
