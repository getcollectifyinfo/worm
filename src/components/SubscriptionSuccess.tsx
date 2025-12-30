import React from 'react';
import { CheckCircle, Play, Home, Trophy, Unlock } from 'lucide-react';

interface SubscriptionSuccessProps {
    onContinue: () => void;
    onHome: () => void;
    source?: string | null;
}

export const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({ onContinue, onHome, source }) => {
    return (
        <div className="fixed inset-0 bg-[#1a1a1a] z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="max-w-4xl w-full bg-gray-800 rounded-3xl border border-green-500/30 overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                 
                {/* Sol Taraf: Görsel / Kutlama */}
                <div className="w-full md:w-1/3 bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border-r border-gray-700">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle size={48} className="text-green-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">TEBRİKLER!</h2>
                    <p className="text-green-400 font-medium text-lg">Pro Üyelik Aktif</p>
                </div>

                {/* Sağ Taraf: Detaylar ve Butonlar */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white mb-6">Neler Kazandın?</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 bg-gray-700/30 p-4 rounded-xl border border-gray-700 hover:border-green-500/30 transition-colors">
                            <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400 mt-1">
                                <Unlock size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-white">Tüm Fazlar Açıldı</div>
                                <div className="text-sm text-gray-400">Orta (Faz 2) ve İleri (Faz 3) seviye pratik modlarına tam erişim.</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-gray-700/30 p-4 rounded-xl border border-gray-700 hover:border-green-500/30 transition-colors">
                            <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 mt-1">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-white">Exam Mode & İstatistikler</div>
                                <div className="text-sm text-gray-400">Gerçek sınav simülasyonu (Faz 4) ve detaylı performans analizleri.</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={onHome}
                            className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            {source === 'mini-exam-end' ? 'Simülasyona Dön' : 'Ana Menü'}
                        </button>
                        
                        <button 
                            onClick={onContinue}
                            className="px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                        >
                            <Play size={20} />
                            {source === 'practice' ? 'Kaldığım Yerden Devam Et' : 'Pratiğe Başla'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
