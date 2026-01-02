import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Play, Plane, Brain, Timer, Target } from 'lucide-react';
import type { Page } from '../../types';

interface SkytestPegasusPageProps {
  onNavigate: (page: Page) => void;
}

export const SkytestPegasusPage: React.FC<SkytestPegasusPageProps> = ({ onNavigate }) => {
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
        <title>Skytest Pegasus | Pegasus Cadet Seçimleri İçin Skytest Hazırlığı</title>
        <meta 
          name="description" 
          content="Pegasus Havayolları cadet pilot seçimlerinde kullanılan Skytest sınavı nedir? Skytest Pegasus sürecine özel hazırlık simülasyonlarını keşfet." 
        />
        <link rel="canonical" href="https://www.cadetprep.academy/skytest-pegasus" />
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Pegasus Skytest Sınavı
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-400 font-semibold mb-8">
            Pegasus cadet pilot seçimlerinde kullanılan Skytest sınavına hazırlık
          </p>

          <div className="space-y-6 text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
            <p>
              Pegasus Havayolları, cadet pilot adaylarının psikometrik ve bilişsel becerilerini değerlendirmek için Skytest tabanlı testler kullanmaktadır. 
              Pegasus Skytest sınavı, adayların dikkat, çoklu görev, uzaysal algı ve tepki sürelerini ölçmeyi hedefler.
            </p>
            <p className="font-medium text-white">
              CadetPrep Academy, Pegasus Skytest sınav formatına uygun hazırlanmış öğrenme, practice ve sınav simülasyonları sunar.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-lg shadow-green-900/20 transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Play size={24} fill="currentColor" />
              Pegasus Skytest Hazırlığına Başla
            </button>
            <span className="text-sm text-slate-500">
              Ücretsiz deneme · Gerçek sınav formatı
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: What is it? */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Pegasus Skytest Nedir?
          </h2>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10">
            <p className="mb-6 text-lg">
              Pegasus Skytest, Pegasus Havayolları’nın pilot adaylarını değerlendirmek için kullandığı psikometrik test sistemidir. 
              Bu testlerde adayların yalnızca bilgi düzeyi değil, bilişsel hız, dikkat, koordinasyon ve stres altında performans becerileri ölçülür.
            </p>
            <p className="text-lg">
              Skytest sınavları, kısa sürede çok sayıda görevle adayları zorlar ve bu nedenle önceden hazırlanmak büyük avantaj sağlar.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Which tests? */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Pegasus Skytest’te Hangi Testler Yer Alır?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
              <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Uzaysal Yetenek</h3>
                <p className="text-slate-400">Uzaysal yön ve Cube Rotation testleri</p>
              </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
              <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                <Timer size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Dikkat & Hız</h3>
                <p className="text-slate-400">Dikkat ve tepki süresi testleri (VIGI benzeri)</p>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
              <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Multitasking</h3>
                <p className="text-slate-400">Çoklu görev ve kapasite testleri</p>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-white/5 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
              <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                <Plane size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Görsel-İşitsel</h3>
                <p className="text-slate-400">Görsel–işitsel dikkat testleri</p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-slate-400 italic">
            Bu testler, adayın aynı anda birden fazla bilgiyi işlemesini gerektirir.
          </p>
        </div>
      </section>

      {/* SECTION 4: How to prepare? */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Pegasus Skytest’e Nasıl Hazırlanılır?
          </h2>
          
          <div className="prose prose-invert max-w-none text-lg leading-relaxed mb-10 text-center">
            <p>
              Pegasus Skytest sınavına hazırlık, yalnızca testleri tekrar etmekle değil, testlerin mantığını öğrenmek ve refleks kazanmakla mümkündür.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 p-8 rounded-2xl border border-blue-500/20">
               <h3 className="text-xl font-bold text-blue-400 mb-6">CadetPrep Academy’de:</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Learn Mode</strong> ile test mantığını öğrenirsin</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Practice Mode</strong> ile refleks kazanırsın</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Mini Exam</strong> ile gerçek sınav hissini yaşarsın</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">
                     <Check size={16} />
                   </div>
                   <span><strong>Pro Exam</strong> ile zor ve uzun senaryoları çalışırsın</span>
                 </li>
               </ul>
             </div>
             
             <div className="flex items-center justify-center p-8 bg-slate-800/30 rounded-2xl border border-white/5">
               <p className="text-lg text-slate-300 italic text-center">
                 "Bu yapı, Pegasus Skytest sınavına girmeden önce adayın zihinsel olarak hazır olmasını sağlar."
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Why CadetPrep? */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Neden CadetPrep Academy ile Hazırlanmalıyım?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Pegasus Skytest formatına uygun simülasyonlar",
              "Öğretici Learn ve yönlendirmeli Practice modülleri",
              "Gerçek sınav temposuna yakın Exam Mode",
              "Tarayıcıdan erişim, kurulum gerektirmez"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-800 p-6 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                  <Check size={18} />
                </div>
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
            Pegasus Skytest sınavına hazır mısın?
          </h2>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-5 px-12 rounded-xl shadow-xl shadow-green-900/30 transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <Play size={28} fill="currentColor" />
              Skytest Pegasus Hazırlığını Ücretsiz Dene
            </button>
            <p className="text-blue-300/80">
              Ücretsiz üyelikle açılır · İstediğin zaman Pro’ya geç
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Disclaimer & Links */}
      <footer className="py-12 bg-[#0B1120] border-t border-white/5 text-sm text-slate-500">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <p className="mb-2">
              CadetPrep Academy, Pegasus Havayolları veya Skytest® firması ile resmi bir bağı olmayan,
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
              href="/skytest-indir" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest indir
            </a>
            <a 
              href="/skytest-turkiye" 
              className="hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              Skytest Türkiye
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
