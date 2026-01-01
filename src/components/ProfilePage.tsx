import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGameAccess } from '../hooks/useGameAccess';
import { statsService } from '../services/statsService';
import { UserBadge } from './UserBadge';
import { Crown, Calendar, Clock, CreditCard, Check, AlertTriangle, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { tier, openLoginGate, handleUpgrade } = useGameAccess();
  const [totalPlayTime, setTotalPlayTime] = useState<number>(0);
  const [canceling, setCanceling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await statsService.getUserStats();
      if (stats) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalSeconds = stats.reduce((acc: number, curr: any) => acc + Number(curr.duration_seconds), 0);
        setTotalPlayTime(totalSeconds);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} ${t('hours_short')} ${minutes} ${t('minutes_short')}`;
    return `${minutes} ${t('minutes_short')}`;
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return t('unknown_date');
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCancelSubscription = async () => {
    if (!confirm(t('cancel_confirm'))) return;
    
    setCanceling(true);
    setCancelMessage(null);

    try {
        const subscriptionId = user?.app_metadata?.stripe_subscription_id;
        
        if (!subscriptionId) {
            setCancelMessage(t('subscription_not_found'));
            setCanceling(false);
            return;
        }

        const response = await fetch('/api/cancel-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionId })
        });

        const data = await response.json();

        if (response.ok) {
            setCancelMessage(`${t('subscription_cancelled')} ${t('renewal_date')}: ${formatDate(data.current_period_end)}`);
        } else {
            setCancelMessage(`${t('error_prefix')} ${data.error}`);
        }
    } catch {
        setCancelMessage(t('error_generic'));
    } finally {
        setCanceling(false);
    }
  };

  const benefits = [
    t('benefits_1'),
    t('benefits_2'),
    t('benefits_3'),
    t('benefits_4')
  ];

  if (!user) {
    return (
        <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
            <div className="text-center">
                <p className="mb-4 text-xl">{t('profile_login_required')}</p>
                <button onClick={openLoginGate} className="bg-blue-600 px-8 py-3 rounded-xl hover:bg-blue-500 font-bold transition-colors">{t('login_button')}</button>
            </div>
        </div>
    );
  }

  const subscriptionEnd = user.app_metadata?.subscription_end;
  const isPro = tier === 'PRO';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 pt-24 relative">
      <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
      >
          ← {t('back_button')}
      </button>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-800 pb-8">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold text-blue-500 shadow-xl border border-slate-700">
                {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h1>
                <p className="text-slate-400 mt-1">{user.email}</p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-3">
                    <UserBadge />
                    <button 
                        onClick={signOut}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 border border-red-900/30 px-2 py-1 rounded-lg bg-red-900/10 hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={12} />
                        {t('signOut')}
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stats Card */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
                    <Clock size={24} />
                    {t('summary_info')}
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                        <span className="text-slate-400">{t('join_date')}</span>
                        <span className="font-medium text-slate-200">{formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                        <span className="text-slate-400">{t('total_play_time')}</span>
                        <span className="font-medium text-slate-200">{formatDuration(totalPlayTime)}</span>
                    </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                        <span className="text-slate-400">{t('membership_type')}</span>
                        <span className={`font-bold px-3 py-1 rounded-full text-sm ${isPro ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-700 text-slate-300'}`}>
                            {isPro ? t('pro_plan') : t('free_plan')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Membership Card */}
            <div className={`rounded-2xl p-6 border relative overflow-hidden ${isPro ? 'bg-slate-900/80 border-yellow-500/30' : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'}`}>
                {isPro && <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none -mr-10 -mt-10"></div>}
                
                <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${isPro ? 'text-yellow-400' : 'text-white'}`}>
                    {isPro ? <Crown size={24} /> : <CreditCard size={24} className="text-slate-400" />}
                    {isPro ? t('membership_status') : t('upgrade_to_pro')}
                </h2>

                {isPro ? (
                    <div className="space-y-6 relative z-10">
                        <div className="bg-yellow-500/5 rounded-xl p-5 border border-yellow-500/20">
                            <p className="text-yellow-200/80 mb-1 uppercase tracking-wider text-xs font-bold">{t('current_plan')}</p>
                            <p className="text-3xl font-bold text-yellow-400">{t('skytest_pro')}</p>
                            {subscriptionEnd ? (
                                <p className="text-yellow-200/60 text-sm mt-3 flex items-center gap-2 bg-yellow-900/20 w-fit px-3 py-1.5 rounded-lg">
                                    <Calendar size={14} />
                                    {t('renewal_date')}: {formatDate(subscriptionEnd)}
                                </p>
                            ) : (
                                <p className="text-yellow-200/60 text-sm mt-3 flex items-center gap-2">
                                    <Check size={14} />
                                    {t('active')}
                                </p>
                            )}
                        </div>
                        
                        {cancelMessage && (
                            <div className="bg-blue-500/20 text-blue-200 p-4 rounded-xl text-sm border border-blue-500/30 flex items-start gap-3">
                                <div className="mt-0.5"><Check size={16} /></div>
                                {cancelMessage}
                            </div>
                        )}

                        {!cancelMessage && (
                            <>
                                <button 
                                    onClick={handleCancelSubscription}
                                    disabled={canceling}
                                    className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <AlertTriangle size={16} className="group-hover:text-red-500 transition-colors" />
                                    {canceling ? t('processing') : t('cancel_subscription')}
                                </button>
                                <p className="text-[10px] text-slate-500 text-center px-4 leading-relaxed">
                                    {t('cancel_warning')}
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <ul className="space-y-3">
                            {benefits.map((b, i) => (
                                <li key={i} className="flex gap-3 text-slate-300 text-sm items-start">
                                    <div className="mt-0.5 bg-green-500/20 p-0.5 rounded-full shrink-0">
                                        <Check size={12} className="text-green-400" />
                                    </div>
                                    <span className="leading-snug">{b}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleUpgrade('profile')}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
                        >
                            <Crown size={20} className="group-hover:rotate-12 transition-transform" />
                            {t('buy_now')}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
