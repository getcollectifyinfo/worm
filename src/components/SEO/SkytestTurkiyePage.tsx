import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Play, Globe, MapPin, Monitor } from 'lucide-react';
import type { Page } from '../../types';

interface SkytestTurkiyePageProps {
  onNavigate: (page: Page) => void;
}

export const SkytestTurkiyePage: React.FC<SkytestTurkiyePageProps> = ({ onNavigate }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartTrial = () => {
    onNavigate('LANDING');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-blue-500/30">
      <Helmet>
        <title>Skytest Türkiye | Skytest Sınavına Türkiye’den Hazırlık</title>
        <meta 
          name="description" 
          content="Skytest Türkiye’de nasıl uygulanır? Skytest sınavına Türkiye’den hazırlanmak için online simülasyonlar ve ücretsiz deneme imkânını keşfet." 
        />
        <link rel="canonical" href="https://www.cadetprep.academy/skytest-turkiye" />
      </Helmet>

      {/* Navigation Placeholder */}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <MapPin size={14} /> Skytest Türkiye
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Skytest Türkiye
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-400 font-semibold mb-8">
            Skytest sınavına Türkiye’den hazırlanmak mümkün mü?
          </p>

          <div className="space-y-6 text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
            <p>
              Skytest, birçok uluslararası havayolunun pilot adayları için kullandığı psikometrik test sistemidir. 
              Türkiye’de pilot adayları, Skytest sınavlarına genellikle yurt dışı merkezli sistemler üzerinden girer.
            </p>
            <p className="font-medium text-white border-l-4 border-blue-500 pl-4 bg-blue-500/5 py-2 rounded-r-lg">
              CadetPrep Academy, Skytest sınavına Türkiye’den erişilebilen online hazırlık simülasyonları sunarak adayların sınav öncesi hazırlık yapmasını sağlar.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-lg shadow-green-900/20 transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Play size={24} fill="currentColor" />
              Skytest Türkiye Hazırlığını Ücretsiz Dene
            </button>
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Globe size={14} /> Tarayıcıdan çalışır · Türkiye’den erişilebilir
            </span>
            <a href="/skytest-ucretsiz" className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Skytest ücretsiz deneme
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: How is it applied? */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Skytest Türkiye’de Nasıl Uygulanır?
          </h2>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10">
            <p className="mb-6 text-lg">
              Skytest sınavları, genellikle havayollarının seçim süreçleri kapsamında adaylara uygulanır. 
              Türkiye’de Skytest sınavına girecek adaylar, sınav merkezine gitmeden önce test formatını tanımak ve refleks kazanmak için hazırlık yapmalıdır.
            </p>
            <p className="text-lg font-medium text-blue-200">
              Bu nedenle sınavdan önce yapılan simülasyon çalışmaları, adaylara ciddi avantaj sağlar.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: How to prepare? */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Türkiye’de Skytest’e Nasıl Hazırlanılır?
          </h2>
          
          <div className="prose prose-invert max-w-none text-lg leading-relaxed mb-10 text-center">
            <p>
              Skytest sınavına hazırlanırken yalnızca testleri görmek yeterli değildir. 
              Özellikle <a href="/skytest-pegasus" className="text-blue-400 hover:text-blue-300 underline">Skytest Pegasus</a> süreçleri gibi zorlu aşamalarda, adayların testlerin mantığını öğrenmesi, hız kazanması ve stres altında performans göstermeyi deneyimlemesi gerekir.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 p-8 rounded-2xl border border-blue-500/20">
               <h3 className="text-xl font-bold text-blue-400 mb-6">CadetPrep Academy bu süreçte:</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Learn Mode</strong> ile test mantığını öğretir</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Practice Mode</strong> ile refleks kazandırır</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Mini Exam</strong> ile gerçek sınav hissi sunar</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Pro Exam</strong> ile uzun ve zor senaryoları çalıştırır</span>
                 </li>
               </ul>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center h-full">
                    <Monitor className="text-blue-400 mb-3" size={32} />
                    <span className="text-sm text-slate-300">Online Erişim</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center h-full">
                    <Globe className="text-green-400 mb-3" size={32} />
                    <span className="text-sm text-slate-300">Türkçe Destek</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center h-full">
                    <Play className="text-purple-400 mb-3" size={32} />
                    <span className="text-sm text-slate-300">Anında Başla</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center h-full">
                    <Check className="text-orange-400 mb-3" size={32} />
                    <span className="text-sm text-slate-300">Ücretsiz Dene</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Why CadetPrep? */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Skytest Türkiye İçin CadetPrep Academy
          </h2>
          
          <div className="mb-10 text-center text-lg text-slate-300 leading-relaxed">
            <p className="mb-4">
              CadetPrep Academy, herhangi bir <a href="/skytest-indir" className="text-blue-400 hover:text-blue-300 underline">Skytest indir</a>me işlemi gerektirmeden tarayıcı üzerinden çalışan, sınav formatına uygun online simülasyonlar sunan bağımsız bir platformdur. 
              Türkiye’deki pilot adayları, sınavdan önce bu simülasyonlarla çalışarak sürpriz yaşamadan sınava girmeyi hedefler.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Türkiye’den kesintisiz erişim",
              "Kurulum gerektirmez",
              "Türkçe açıklamalar ve yönlendirmeler",
              "Ücretsiz deneme imkânı"
            ].map((item, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded-lg border border-white/5 text-center flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Check size={16} />
                </div>
                <span className="text-sm font-medium text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Who is it for? */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Skytest Türkiye Hazırlığı Kimler İçin Uygun?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Türkiye’de yaşayan cadet pilot adayları",
              "Pegasus ve benzeri havayollarına başvuracak adaylar",
              "Skytest sınavını ilk kez deneyimleyecek olanlar",
              "Sınavdan önce formatı tanımak isteyen adaylar"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-800 p-6 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                <span className="font-medium text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-900/40 to-slate-900 border-t border-blue-500/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Skytest sınavına Türkiye’den hazırlan
          </h2>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-5 px-12 rounded-xl shadow-xl shadow-green-900/30 transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <Play size={28} fill="currentColor" />
              Skytest Türkiye Ücretsiz Denemesini Başlat
            </button>
            <p className="text-blue-300/80">
              Ücretsiz üyelikle açılır · Kredi kartı gerekmez
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Disclaimer & Links */}
      <footer className="py-12 bg-[#0B1120] border-t border-white/5 text-sm text-slate-500">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <p className="mb-2">
              CadetPrep Academy, Skytest® firması veya herhangi bir havayolu ile resmi bir bağı olmayan,
            </p>
            <p>
              Skytest sınavlarına hazırlık amaçlı simülasyonlar sunan bağımsız bir platformdur.
            </p>
          </div>

          {/* Internal Linking */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-6 border-t border-white/5">
            <a 
              href="/skytest-ucretsiz" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest ücretsiz deneme
            </a>
            <a 
              href="/skytest-pegasus" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest Pegasus
            </a>
            <a 
              href="/skytest-indir" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest indir
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
