import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, X, Download, Play, Globe } from 'lucide-react';
import type { Page } from '../../types';

interface SkytestIndirPageProps {
  onNavigate: (page: Page) => void;
}

export const SkytestIndirPage: React.FC<SkytestIndirPageProps> = ({ onNavigate }) => {
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
        <title>Skytest İndir | Skytest Yazılımı ve Online Hazırlık Simülasyonları</title>
        <meta 
          name="description" 
          content="Skytest indirilebilir mi? Skytest yazılımı nedir, nasıl çalışır? Skytest sınavına hazırlanmak için online simülasyonları keşfet." 
        />
        <link rel="canonical" href="https://www.cadetprep.academy/skytest-indir" />
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
            Skytest İndirilebilir mi?
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-400 font-semibold mb-8">
            Skytest yazılımı ve hazırlık simülasyonları arasındaki farklar
          </p>

          <div className="space-y-6 text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
            <p className="text-xl text-white font-medium border-l-4 border-blue-500 pl-4 bg-blue-500/5 py-2 rounded-r-lg">
              Skytest, Skytest® firması tarafından geliştirilen ve ücretli olarak satılan, indirilebilir bir psikometrik test yazılımıdır. 
              Adaylar Skytest yazılımını satın alarak bilgisayarlarına indirip testlere erişebilir.
            </p>
            <p>
              Ancak Skytest yazılımı, sınavlara nasıl hazırlanılması gerektiğini öğreten öğrenme ve alıştırma modülleri sunmaz.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-lg shadow-green-900/20 transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Play size={24} fill="currentColor" />
              Skytest Hazırlık Simülasyonlarını Dene
            </button>
            <span className="text-sm text-slate-500">
              Tarayıcıdan çalışır · Ücretsiz deneme mevcut
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: What is it? */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Skytest Yazılımı Nedir?
          </h2>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10">
            <p className="mb-6 text-lg">
              Skytest yazılımı, havayolu pilot seçim süreçlerinde kullanılan çeşitli psikometrik testleri içeren bir desktop uygulamasıdır. 
              Bu yazılım, adayların testlere doğrudan girmesini sağlar ancak öğretici veya yönlendirmeli bir hazırlık süreci sunmaz.
            </p>
            <p className="mb-4 font-semibold text-white">Öne çıkan özellikler:</p>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                <Download className="text-blue-400" size={20} />
                <span>İndirilebilir (desktop yazılım)</span>
              </li>
              <li className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center text-xs font-bold text-blue-400">€</div>
                <span>Ücretli (~90 EUR)</span>
              </li>
              <li className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                <Check className="text-green-400" size={20} />
                <span>Gerçek test formatı</span>
              </li>
              <li className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                <X className="text-red-400" size={20} />
                <span>Öğrenme ve practice modülleri yok</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: How to download? */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Skytest Yazılımı Nasıl İndirilir?
          </h2>
          <div className="prose prose-invert max-w-none text-lg leading-relaxed">
            <p>
              Skytest yazılımı, Skytest® firmasının resmi kanalları üzerinden satın alınarak indirilebilir. 
              Yazılımın ücretsiz, crack veya torrent sürümleri resmi değildir ve önerilmez.
            </p>
            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
              <p className="mb-0 text-blue-200">
                Skytest sınavına hazırlık için alternatif olarak, indirmenize gerek kalmadan tarayıcı üzerinden çalışan simülasyonlar da bulunmaktadır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Comparison Table */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Skytest Yazılımı vs CadetPrep Academy
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-left text-slate-400 font-medium">Özellik</th>
                  <th className="py-4 px-6 text-center text-slate-400 font-medium bg-slate-800/30 rounded-t-lg">Skytest Yazılımı</th>
                  <th className="py-4 px-6 text-center text-blue-400 font-bold bg-blue-900/10 rounded-t-lg border-t-2 border-blue-500">CadetPrep Academy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { feature: "Kurulum", sky: "İndirme gerekir", cp: "Tarayıcıdan", highlight: true },
                  { feature: "Fiyat", sky: "~90 EUR", cp: "Aylık / daha erişilebilir", highlight: true },
                  { feature: "Learn Mode", sky: false, cp: true },
                  { feature: "Practice Mode", sky: false, cp: true },
                  { feature: "Mini Exam", sky: false, cp: true },
                  { feature: "Gerçek Exam Simülasyonu", sky: false, cp: true }, // Correction based on user input: Skytest Yazılımı table says "Gerçek Exam Simülasyonu" -> X in user prompt table, but wait. User prompt table says: Skytest Yazılımı: ❌ for Gerçek Exam Simülasyonu? Wait.
                  // User prompt:
                  // Özellik	Skytest Yazılımı	CadetPrep Academy
                  // Gerçek Exam Simülasyonu	❌	✅
                  // But previously in "Features" list it said "Gerçek test formatı".
                  // I will stick to the Comparison Table provided by user strictly.
                  { feature: "Analiz & Geri Bildirim", sky: false, cp: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-slate-300 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-slate-400 bg-slate-800/30">
                      {typeof row.sky === 'boolean' ? (
                        row.sky ? <Check className="inline text-green-500" size={20} /> : <X className="inline text-red-500" size={20} />
                      ) : (
                        <span className={row.feature === 'Kurulum' ? 'text-orange-400' : ''}>{row.sky}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-white bg-blue-900/10 font-medium">
                      {typeof row.cp === 'boolean' ? (
                        row.cp ? <Check className="inline text-green-400" size={20} /> : <X className="inline text-red-400" size={20} />
                      ) : (
                        <span className="text-green-400">{row.cp}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-8 mt-8 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500"></div>
              <span>Skytest yazılımı test aracıdır.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-blue-200">CadetPrep Academy ise sınava hazırlık platformudur.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Alternative */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Skytest İndirmek Yerine Ne Yapmalıyım?
          </h2>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10 shadow-xl">
            <p className="text-lg mb-6 leading-relaxed">
              Skytest sınavına hazırlık sürecinde en önemli konu, testlerin mantığını anlamak ve refleks kazanmaktır.
            </p>
            <p className="text-lg mb-6 leading-relaxed text-slate-300">
              Bu nedenle adayların, öğrenme ve practice modülleri içeren simülasyonlarla çalışması önerilir. 
              <strong className="text-blue-400 ml-1">CadetPrep Academy</strong>, Skytest sınav formatına uygun hazırlanmış simülasyonlar ile bu süreci online olarak sunar.
            </p>
            <Globe className="w-16 h-16 text-blue-500/20 mx-auto mt-8" />
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-900/40 to-slate-900 border-t border-blue-500/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Skytest sınavına hazırlanmaya başla
          </h2>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleStartTrial}
              className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-5 px-12 rounded-xl shadow-xl shadow-green-900/30 transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <Play size={28} fill="currentColor" />
              Skytest Hazırlık Simülasyonlarını Dene
            </button>
            <p className="text-blue-300/80">
              Ücretsiz deneme · Kredi kartı gerekmez
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
