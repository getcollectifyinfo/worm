import React, { useState } from 'react';
import { X, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { newsletterService } from '../services/newsletterService';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string; // The package they are interested in (e.g., "DLR", "Mollymawk")
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose, packageName }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('LOADING');
    const { success } = await newsletterService.subscribe(email, packageName);
    
    if (success) {
      setStatus('SUCCESS');
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
        setStatus('IDLE');
        setEmail('');
      }, 2000);
    } else {
      setStatus('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {status === 'SUCCESS' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Kaydınız Alındı!</h3>
            <p className="text-slate-400">
              {packageName} paketi hazır olduğunda size haber vereceğiz.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{packageName} Paketi Bekleme Listesi</h3>
              <p className="text-slate-400 text-sm">
                Bu paket şu anda hazırlık aşamasında. Hazır olduğunda ilk sizin haberiniz olsun ister misiniz?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email Adresi</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'LOADING'}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'LOADING' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  'Haberdar Ol'
                )}
              </button>
              
              {status === 'ERROR' && (
                <p className="text-red-400 text-xs text-center">
                  Bir hata oluştu. Lütfen tekrar deneyin.
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};
