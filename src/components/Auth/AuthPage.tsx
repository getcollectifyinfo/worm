import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Loader2 } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
  isEmbedded?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, isEmbedded = false }) => {
  const { signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // If email confirmation is disabled, user is logged in automatically
        if (data.session) {
            onSuccess();
        } else {
            // Should not happen if email confirmation is disabled, but handle just in case
            setError('Account created! Please sign in.');
            setIsLogin(true);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isEmbedded ? 'w-full' : 'min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4'}`}>
      <div className={`w-full ${isEmbedded ? '' : 'max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700'}`}>
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="CadetPrep Academy" className="h-32" />
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isLogin ? 'Sign in to access Cadetprep Academy' : 'Join Cadetprep Academy today'}
        </p>

        {error && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${error.includes('Check your email') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
            {error}
          </div>
        )}

        <button
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
          
          {!isLogin && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Hesap oluşturarak, <a href="/terms" className="text-purple-400 hover:underline">Kullanım Şartları</a>, <a href="/privacy" className="text-purple-400 hover:underline">Gizlilik Politikası</a> ve <a href="/yasal-uyari" className="text-purple-400 hover:underline">Yasal Uyarı</a> metinlerini okuduğunuzu ve kabul ettiğinizi beyan edersiniz.
            </p>
          )}
        </form>

        {/* 
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-6"
        >
          <Chrome size={20} />
          Google
        </button> 
        */}

        <p className="text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-purple-400 hover:text-purple-300 font-bold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            CadetPrep Academy, bağımsız bir hazırlık platformudur. SkyTest, Pegasus ve diğer tüm ticari markalar ilgili hak sahiplerine aittir. 
            Platform, herhangi bir havayolu veya resmi test sağlayıcısı ile bağlantılı değildir.
            <br />
            <a href="/yasal-uyari" className="text-purple-400 hover:text-purple-300 underline mt-1 inline-block">
              Yasal Uyarı (Legal Disclaimer)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
