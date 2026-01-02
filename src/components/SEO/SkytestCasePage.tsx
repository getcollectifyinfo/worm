import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import type { Page } from '../../types';
import { Brain, Target, Activity, Layers, Clock, CheckCircle, Monitor, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

interface SkytestCasePageProps {
  onNavigate: (page: Page) => void;
}

export const SkytestCasePage: React.FC<SkytestCasePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartTrial = () => {
    onNavigate('LANDING');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-blue-500/30">
      <Helmet>
        <title>Skytest CASE | Cockpit Aptitude Screening Environment (CASE) Nedir?</title>
        <meta 
          name="description" 
          content="Skytest CASE nedir? Cockpit Aptitude Screening Environment (CASE) testleri, içerikleri ve sınav yapısı hakkında detaylı açıklamalar ve simülasyonlar." 
        />
        <link rel="canonical" href="https://www.cadetprep.academy/skytest-case" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <Activity size={12} />
            <span>Cockpit Aptitude Screening Environment (CASE) nedir?</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Skytest CASE
          </h1>

          <div className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
            <p className="mb-4">
              CASE (Cockpit Aptitude Screening Environment), Skytest tarafından geliştirilen ve pilot adaylarının bilişsel, psikomotor ve çoklu görev becerilerini ölçmek için kullanılan bilgisayar tabanlı bir test ortamıdır.
            </p>
            <p className="mb-4">
              Skytest CASE, tek bir testten değil; farklı yetkinlik alanlarını ölçen birden fazla testten oluşan bir değerlendirme ortamıdır.
            </p>
            <p>
              CadetPrep Academy, CASE ortamında kullanılan test mantıklarına uygun hazırlanmış öğrenme, practice ve sınav simülasyonları sunar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button 
              onClick={handleStartTrial}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              Skytest CASE Simülasyonlarını Dene
              <ArrowRight size={18} />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2 mb-8">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Monitor size={14} /> Ücretsiz deneme · Tarayıcıdan çalışır
            </span>
            {/* Mandatory Link 1 */}
            <a href="/skytest" className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Skytest sınavı
            </a>
          </div>
        </div>
      </div>

      {/* Section 1: What is CASE? */}
      <div className="py-16 md:py-24 bg-[#0F172A] relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Brain size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Cockpit Aptitude Screening Environment (CASE) Nedir?
            </h2>
          </div>
          
          <div className="prose prose-invert max-w-none text-lg text-slate-300 leading-relaxed">
            <p className="mb-6">
              Cockpit Aptitude Screening Environment (CASE), pilot adaylarının kokpit ortamında karşılaşacağı zihinsel yükü simüle etmek amacıyla tasarlanmış bir değerlendirme sistemidir.
            </p>
            <p className="mb-6">
              Bu ortamda testler bilgisayar üzerinden uygulanır ve adaylar joystick, kulaklık ve klavye kullanarak görevleri yerine getirir. Test zorluk seviyeleri ve süreleri tüm adaylar için standarttır.
            </p>
            <p>
              CASE, adayların yalnızca doğru cevap vermesini değil; aynı anda birden fazla görevi yönetmesini, hızlı karar almasını ve stres altında performans göstermesini ölçer.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Competencies */}
      <div className="py-16 md:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Target size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Skytest CASE Ortamında Hangi Yetkinlikler Ölçülür?
            </h2>
          </div>

          <p className="text-lg text-slate-300 mb-8">
            Skytest CASE testleri, pilotluk için kritik olan aşağıdaki yetkinlikleri ölçmeyi amaçlar:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              "Uzaysal algı ve yön duygusu",
              "Dikkat ve süreklilik (vigilance)",
              "Bölünmüş dikkat (görsel ve işitsel)",
              "Çoklu görev ve önceliklendirme",
              "Psikomotor beceriler (el–göz koordinasyonu)",
              "Kısa süreli hafıza",
              "Stres altında karar verme"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <CheckCircle className="text-indigo-400 shrink-0 mt-1" size={18} />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-slate-300">
            Bu yetkinlikler, gerçek kokpit ortamındaki iş yükünü temsil edecek şekilde birlikte test edilir.
          </p>
        </div>
      </div>

      {/* Section 3: Tests Included */}
      <div className="py-16 md:py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Layers size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Skytest CASE İçerisinde Yer Alan Testler
            </h2>
          </div>

          <p className="text-lg text-slate-300 mb-8">
            CASE ortamı, farklı bilişsel ve motor becerileri ölçen birden fazla testten oluşur. Bu testler arasında şunlar yer alır:
          </p>

          <div className="space-y-4 mb-8">
            {[
              "Vigilance testleri (görsel ve işitsel dikkat)",
              "Spatial Orientation 2D ve 3D testleri",
              "Information Perception and Processing testleri",
              "Capacity ve Flight Capacity testleri"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border-l-4 border-emerald-500">
                <span className="text-white font-medium">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-slate-300">
            Bu testlerin bir kısmı aynı anda birden fazla görevin yürütülmesini gerektirir ve zorluk seviyesi ilerledikçe iş yükü artar.
          </p>
        </div>
      </div>

      {/* Section 4: Logic */}
      <div className="py-16 md:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Clock size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Skytest CASE Mantığı Nasıl Çalışır?
            </h2>
          </div>

          <p className="text-lg text-slate-300 mb-8">
            Skytest CASE ortamında testler klasik soru–cevap yapısında ilerlemez. Adaylar, belirli bir süre boyunca kesintisiz görevler yapar ve performansları bu süre zarfında ölçülür.
          </p>

          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">CASE mantığında:</h3>
            <ul className="space-y-4">
              {[
                "Testler zaman bazlı veya görev bazlıdır",
                "Bazı testlerde birden fazla alt görev eş zamanlı yürütülür",
                "Yeni kurallar ve görevler test sırasında değişebilir",
                "Tepki süresi ve doğruluk birlikte değerlendirilir"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-lg text-slate-300">
            Bu yapı, pilot adaylarının gerçek uçuş ortamındaki iş yüküne ne kadar uyum sağlayabildiğini ölçmeyi hedefler.
          </p>
        </div>
      </div>

      {/* Section 5: Preparation */}
      <div className="py-16 md:py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Skytest CASE’e Nasıl Hazırlanılır?
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-lg text-slate-300 leading-relaxed mb-8">
            <p>
              Skytest CASE testlerine hazırlanırken yalnızca testleri görmek yeterli değildir. Adayların test ortamına ve çoklu görev yapısına zihinsel olarak alışması gerekir.
            </p>
            {/* Mandatory Link 2 */}
            <p className="mt-4">
              Daha fazla pratik için <a href="/skytest-ucretsiz" className="text-blue-400 hover:text-blue-300 underline">Skytest Practice Mode</a> seçeneklerini inceleyebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { title: "Learn Mode", desc: "Testlerin nasıl çalıştığını öğretir" },
              { title: "Practice Mode", desc: "Görevleri adım adım alıştırır" },
              { title: "Mini Exam", desc: "Kısa CASE senaryoları sunar" },
              { title: "Pro Exam", desc: "Uzun ve yoğun CASE simülasyonları uygular" }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-lg text-slate-300">
            <p className="mb-4">
              Bu yaklaşım, adayların sınav günü karşılaşacağı zihinsel yükü önceden deneyimlemesini sağlar.
            </p>
            {/* Mandatory Link 3 */}
            <p>
              Özellikle <a href="/skytest-pegasus" className="text-blue-400 hover:text-blue-300 underline">Skytest Pegasus</a> hazırlık sürecinde bu simülasyonlar büyük önem taşır.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Link 4 (Before Conversion) */}
      <div className="container mx-auto px-4 max-w-4xl mb-8 text-center">
        <a href="/skytest-turkiye" className="text-blue-400 hover:text-blue-300 underline text-lg">
          Skytest Türkiye
        </a>
      </div>

      {/* Section 6: Conversion */}
      <div className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Skytest CASE ortamına hazırlanmaya başla
          </h2>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed">
            CadetPrep Academy ile Skytest CASE testlerinde kullanılan mantığı ve görev yapılarını ücretsiz olarak deneyebilir, daha ileri seviye simülasyonlar için Pro üyeliğe geçebilirsin.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleStartTrial}
              className="px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl shadow-white/10"
            >
              Skytest CASE Simülasyonlarını Ücretsiz Dene
            </button>
            <span className="text-sm text-slate-400">
              Ücretsiz üyelikle açılır · Kredi kartı gerekmez
            </span>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="py-12 bg-[#0F172A] border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-500/80">
            <AlertTriangle size={20} />
            <span className="font-semibold uppercase tracking-wider text-sm">Yasal Şeffaflık</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            CadetPrep Academy, Skytest® firması veya herhangi bir havayolu ile resmi bir bağı olmayan, Cockpit Aptitude Screening Environment (CASE) testlerine hazırlık amaçlı simülasyonlar sunan bağımsız bir platformdur.
          </p>
        </div>
      </div>

      {/* Footer Mini Nav (Mandatory Link 5) */}
      <div className="py-8 bg-[#0F172A] border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <a href="/skytest-ucretsiz" className="hover:text-blue-400 transition-colors">Skytest ücretsiz deneme</a>
            <span className="text-slate-700">•</span>
            <a href="/skytest-pegasus" className="hover:text-blue-400 transition-colors">Skytest Pegasus</a>
            <span className="text-slate-700">•</span>
            <a href="/skytest-turkiye" className="hover:text-blue-400 transition-colors">Skytest Türkiye</a>
            <span className="text-slate-700">•</span>
            <a href="/skytest-indir" className="hover:text-blue-400 transition-colors">Skytest indir</a>
          </div>
        </div>
      </div>
    </div>
  );
};
