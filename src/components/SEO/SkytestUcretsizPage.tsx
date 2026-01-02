import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, X, Play } from 'lucide-react';
import type { Page } from '../../types';

interface SkytestUcretsizPageProps {
  onNavigate: (page: Page) => void;
}

export const SkytestUcretsizPage: React.FC<SkytestUcretsizPageProps> = ({ onNavigate }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartTrial = () => {
    // Navigate to a relevant page, e.g., LANDING or directly to a demo simulation if available
    // For now, let's send them to LANDING where they can choose a module or sign up
    onNavigate('LANDING');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-blue-500/30">
      <Helmet>
        <title>Skytest Ücretsiz Deneme | Skytest Hazırlık Simülasyonları</title>
        <meta 
          name="description" 
          content="Skytest ücretsiz deneme ile gerçek sınav formatını keşfet. Mini Exam, Practice ve öğrenme modülleriyle Skytest’e hazırlanmaya başla." 
        />
        <link rel="canonical" href="https://www.cadetprep.academy/skytest-ucretsiz" />
      </Helmet>

      {/* Navigation Placeholder (if needed, or user uses global nav) */}
      <nav className="border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
            onClick={() => onNavigate('MARKETING')}
          >
            CadetPrep
          </div>
          <button 
            onClick={handleStartTrial}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Simülasyonları Dene
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Skytest Ücretsiz Deneme
          </h1>
          
          {/* Visual H2-like text */}
          <p className="text-xl md:text-2xl text-blue-400 font-semibold mb-8">
            Skytest sınavını ücretsiz olarak tanı
          </p>

          <div className="space-y-6 text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
            <p>
              Skytest, birçok havayolunun pilot adayları için kullandığı psikometrik testlerden biridir. 
              CadetPrep Academy, Skytest sınavlarına hazırlanmak isteyen adaylar için ücretsiz deneme imkânı sunar.
            </p>
            <p>
              Skytest ücretsiz deneme ile gerçek sınav formatını görebilir, mini sınavları deneyebilir ve Practice modunda temel alıştırmaları yapabilirsin.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-lg shadow-green-900/20 transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Play size={24} fill="currentColor" />
              Skytest Ücretsiz Dene
            </button>
            <span className="text-sm text-slate-500">
              Kredi kartı gerekmez · Tarayıcıdan çalışır
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: What is it? */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Skytest Ücretsiz Deneme Nedir?
          </h2>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10">
            <p className="mb-6 text-lg">
              Skytest ücretsiz deneme, adayların sınav formatını tanıması için sunulan sınırlı bir deneyimdir. 
              Bu deneme sürümünde adaylar, gerçek sınav mantığına uygun hazırlanmış Mini Exam ve temel Practice alıştırmalarını oynayabilir.
            </p>
            <p className="mb-4 font-semibold text-white">Ücretsiz denemede şunlar yer alır:</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>2 dakikalık Mini Exam (Easy seviye)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Temel Practice alıştırmaları</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Sınav mantığını öğreten Learn Mode</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: Is it free? */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Skytest Ücretsiz mi?
          </h2>
          <div className="prose prose-invert max-w-none text-lg leading-relaxed">
            <p>
              Skytest yazılımı, Skytest® firması tarafından geliştirilen ve ücretli olarak satılan bir test yazılımıdır.
            </p>
            <p>
              Ancak Skytest sınavına hazırlanmak isteyen adaylar için, CadetPrep Academy üzerinden ücretsiz deneme ve hazırlık simülasyonları sunulmaktadır. 
              Bu ücretsiz deneme, Skytest sınavına girmeden önce test formatını tanımak ve kendini denemek isteyen adaylar için idealdir.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: What's included? */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Skytest Ücretsiz Denemede Neler Var?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Dahil Olanlar</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 shrink-0 mt-1" size={20} />
                  <span>Mini Exam (2 dakika – gerçek sınav hissi)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 shrink-0 mt-1" size={20} />
                  <span>Learn Mode (test mantığını öğretir)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 shrink-0 mt-1" size={20} />
                  <span>Practice Mode (temel alıştırmalar)</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-red-400 mb-4">Dahil Olmayanlar</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="text-red-400 shrink-0 mt-1" size={20} />
                  <span>Orta / zor seviye sınavlar</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 shrink-0 mt-1" size={20} />
                  <span>Detaylı analiz ve istatistikler</span>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="text-center mt-8 text-slate-400 italic">
            Daha uzun ve zor sınavlar Pro üyelikle açılır.
          </p>
        </div>
      </section>

      {/* SECTION 5: Who is it for? */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Skytest Ücretsiz Deneme Kimler İçin Uygun?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Skytest sınavına ilk kez girecek adaylar",
              "Pegasus ve benzeri havayollarının cadet programlarına hazırlananlar",
              "Skytest yazılımını satın almadan önce sınavı tanımak isteyenler"
            ].map((item, i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-xl border border-white/5 flex items-center justify-center h-full">
                <p className="font-medium text-blue-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-900/40 to-slate-900 border-t border-blue-500/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Skytest sınavını ücretsiz denemeye başla
          </h2>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-5 px-12 rounded-xl shadow-xl shadow-green-900/30 transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <Play size={28} fill="currentColor" />
              Ücretsiz Denemeyi Başlat
            </button>
            <p className="text-blue-300/80">
              Ücretsiz üyelikle açılır · İstediğin zaman Pro’ya geçebilirsin
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Disclaimer & Links */}
      <footer className="py-12 bg-[#0B1120] border-t border-white/5 text-sm text-slate-500">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <p className="mb-2">
              CadetPrep Academy, Skytest® yazılımının resmi satıcısı değildir.
            </p>
            <p>
              Sunulan içerikler, Skytest sınavlarına hazırlık amaçlı simülasyonlardır.
            </p>
          </div>

          {/* Internal Linking */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-6 border-t border-white/5">
            <a 
              href="/skytest-pegasus" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest Pegasus
            </a>
            <a 
              href="/skytest-turkiye" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest Türkiye
            </a>
            <a 
              href="/skytest-indir" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest indirilebilir mi?
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
