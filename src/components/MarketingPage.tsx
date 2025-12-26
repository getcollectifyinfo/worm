import React from 'react';
import { Check, ArrowRight, Brain, Clock, Target, Award, Play, Zap } from 'lucide-react';

interface MarketingPageProps {
  onStartDemo: () => void;
  onViewProduct: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({ onStartDemo, onViewProduct }) => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 pt-32 pb-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img src="/logo.png" alt="CadetPrep Academy" className="h-48 md:h-64 drop-shadow-2xl" />
            </div>
            <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 font-medium text-sm tracking-wide">
              Zihnini Eğit. Kanatlarını Kazan.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Pilot Adayları İçin Gelişmiş Psikometrik Hazırlık Platformu
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Havayolu cadet seçim süreçlerinde kullanılan gerçek yetenek testleriyle pratik yapın.
              Hız, doğruluk ve karar verme becerilerinizi sınavdan önce mükemmelleştirin.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <button 
                onClick={onStartDemo}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Ücretsiz Dene
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={onViewProduct}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all border border-white/10 backdrop-blur-sm"
              >
                SKYTEST Paketini İncele
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {[
                "Gerçekçi PACE / DLR / Skytest tarzı simülasyonlar",
                "Zamanlı egzersizler ve performans takibi",
                "Bilişsel, çoklu görev ve uzaysal beceri eğitimi",
                "First Officer ve Cadet adayları için tasarlandı"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="mt-1 text-green-400 shrink-0">
                    <Check size={16} />
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <section className="py-24 bg-[#0B1120] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Ne Yapıyoruz?</h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              CadetPrep Academy, pilot adaylarının psikometrik ve bilişsel becerilerini geliştirmelerine yardımcı olmak için tasarlanmış bağımsız bir çevrimiçi hazırlık platformudur.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Simülasyonlarımız, yaygın havayolu değerlendirme metodolojilerinden esinlenmiştir ancak herhangi bir havayolu veya test yetkilisiyle bağlantılı değildir.
            </p>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Eğitim Modülleri</h2>
            <p className="text-gray-400">Geleceğin pilotlarından beklenen bilişsel becerileri geliştirin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <Brain />, title: "Bilişsel Temel", desc: "Zihinsel işlem hızı ve doğruluğu" },
              { icon: <Target />, title: "Uzaysal Farkındalık", desc: "Oryantasyon ve 3B görselleştirme" },
              { icon: <Clock />, title: "Zihinsel Aritmetik", desc: "Zaman baskısı altında hızlı hesaplama" },
              { icon: <Award />, title: "Hafıza ve Dikkat", desc: "Kısa süreli bellek kapasitesini artırma" },
              { icon: <Play />, title: "Multitasking", desc: "Birden fazla bilgi akışını aynı anda yönetme" },
              { icon: <Zap />, title: "Tepki Hızı", desc: "Tepki sürelerinizi test edin ve iyileştirin" },
              { icon: <Target />, title: "Pilot Yeteneği", desc: "Kapsamlı yetenek simülasyonu" },
              { icon: <Brain />, title: "Karar Verme", desc: "Baskı altında kritik düşünme" }
            ].map((module, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {module.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{module.title}</h3>
                <p className="text-sm text-gray-400">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#0B1120] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Üyelik Planları</h2>
            <p className="text-gray-400">Hazırlık süreciniz için doğru planı seçin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <div className="mb-6">
                <div className="text-green-400 font-bold mb-2">Başlangıç</div>
                <div className="text-3xl font-bold">Ücretsiz</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400" /> Sınırlı pratik modülleri
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400" /> Örnek simülasyonlar
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400" /> Performans özeti
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-red-500 text-xs">⛔</span> Gelişmiş analiz yok
                </li>
              </ul>
              <button 
                onClick={onStartDemo}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all"
              >
                Hemen Başla
              </button>
            </div>

            {/* Pro - Highlighted */}
            <div className="p-8 rounded-2xl bg-blue-600/20 border border-blue-500/50 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-lg">ÖNERİLEN</div>
              <div className="mb-6">
                <div className="text-blue-400 font-bold mb-2">SKYTEST Paketi</div>
                <div className="text-3xl font-bold">500 TL <span className="text-lg text-gray-400 font-normal">/ Ay</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> Tüm modüllere erişim
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> Detaylı performans analizi
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> SKYTEST Simülasyonu
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> 7/24 Destek
                </li>
              </ul>
              <button 
                onClick={onViewProduct}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Paketi İncele
              </button>
            </div>
            
            {/* DLR Plan (Coming Soon) */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col opacity-70 grayscale">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                   <div className="text-purple-400 font-bold mb-2">DLR Paketi</div>
                   <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">YAKINDA</span>
                </div>
                <div className="text-3xl font-bold">---</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check size={16} className="text-gray-600" /> DLR Modülleri
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check size={16} className="text-gray-600" /> Fizik & Matematik
                </li>
              </ul>
              <button disabled className="w-full py-3 bg-white/5 text-gray-500 rounded-lg font-bold cursor-not-allowed">
                Çok Yakında
              </button>
            </div>

            {/* All-in-One (Coming Soon) */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col opacity-70 grayscale">
               <div className="mb-6">
                <div className="flex justify-between items-start">
                   <div className="text-orange-400 font-bold mb-2">Full Paket</div>
                   <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">YAKINDA</span>
                </div>
                <div className="text-3xl font-bold">---</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check size={16} className="text-gray-600" /> Tüm Sınav Sistemleri
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check size={16} className="text-gray-600" /> Sınırsız Erişim
                </li>
              </ul>
              <button disabled className="w-full py-3 bg-white/5 text-gray-500 rounded-lg font-bold cursor-not-allowed">
                Çok Yakında
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#050914] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">CadetPrep Academy</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                CadetPrep Academy is an independent training platform.
                All trademarks and test names mentioned are the property of their respective owners.
                This platform is not affiliated with, approved, or endorsed by any airline or official testing organization.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-white mb-4">Platform</h4>
                <ul className="space-y-2 text-gray-500">
                  <li><a href="#" className="hover:text-blue-400">Modules</a></li>
                  <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
                  <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-500">
                  <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-blue-400">Disclaimer</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
            © 2024 CadetPrep Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Add necessary import to App.tsx
// import { Zap, Brain } from 'lucide-react'; 
