import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Brain, Target, Zap, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface SkytestPreparationBlogPageProps {
  onNavigate: (page: string) => void;
}

export const SkytestPreparationBlogPage: React.FC<SkytestPreparationBlogPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Helmet>
        <title>Skytest'e Nasıl Hazırlanılır? Gerçekçi Hazırlık Rehberi - CadetPrep</title>
        <meta name="description" content="Skytest hazırlık sürecinde yapılan hatalar, evde çalışmanın riskleri ve simülasyonla çalışmanın avantajları. Pilot adayları için kapsamlı rehber." />
        <link rel="canonical" href="https://cadetprep.com/skytest-hazirlik" />
        <meta property="og:title" content="Skytest'e Nasıl Hazırlanılır? Gerçekçi Yöntemler" />
        <meta property="og:description" content="Skytest hazırlığında başarıya ulaşmak için stratejik ipuçları. Zaman baskısı, multitasking ve doğru simülasyon kullanımı." />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Header / Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('MARKETING')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              CP
            </div>
            <span className="font-bold text-slate-900">CadetPrep</span>
          </div>
          <button 
            onClick={() => onNavigate('SKYTEST_PRODUCT')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Paketi İncele
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-medium text-sm">
              Skytest Hazırlık Rehberi
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Skytest'e Nasıl Hazırlanılır? <br />
              <span className="text-blue-400">Gerçekçi Yöntemler ve Stratejiler</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Pilot adaylarının %60'ı yetenek eksikliğinden değil, yanlış hazırlık stratejileri yüzünden eleniyor. Peki, doğru yöntem nedir?
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          
          {/* Introduction */}
          <div className="prose prose-lg prose-slate max-w-none mb-16">
            <p>
              Havacılık mülakat süreçleri, sadece bilgi veya yetenek ölçümü değildir; aynı zamanda stres altında doğru karar verme, dayanıklılık ve öğrenme kapasitenizi test eden karmaşık bir süreçtir. Skytest gibi bilgisayar tabanlı yetenek testleri (CBT), bu sürecin en kritik eleme aşamalarından birini oluşturur.
            </p>
            <p>
              Birçok aday, bu testleri "zeka oyunu" veya "bulmaca" gibi görerek evde rahat bir ortamda hazırlanmaya çalışır. Ancak gerçek sınav ortamı, evdeki konfor alanınızdan çok farklıdır. Bu yazıda, adayların sıkça yaptığı hataları, evde hazırlığın neden yetersiz kaldığını ve simülasyon destekli çalışmanın neden hayati olduğunu inceleyeceğiz.
            </p>
          </div>

          {/* Section 1: Yaygın Hatalar */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={32} />
              Adayların Yaptığı Yaygın Hatalar
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-3">1. Ezberlemeye Çalışmak</h3>
                <p className="text-slate-600">
                  Skytest modülleri dinamiktir. Soruların sırasını veya cevapları ezberlemeye çalışmak, sınavda karşılaşacağınız küçük bir değişkenlikte (örneğin küpün dönüş hızı veya sayı dizisinin mantığı değiştiğinde) donup kalmanıza neden olur. Sistem ezber değil, adaptasyon yeteneğinizi ölçer.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-3">2. Sadece "Yapabilmeye" Odaklanmak</h3>
                <p className="text-slate-600">
                  Soruyu çözmek yetmez; soruyu <strong>belirlenen sürede</strong> ve <strong>baskı altında</strong> çözmek gerekir. Evde kahvenizi yudumlayarak %90 başarı oranı yakalamak, sınavda titreyen ellerle %50 başarıya düşmenizi engellemez. Hız ve doğruluk dengesi (Speed/Accuracy Trade-off) hayati önem taşır.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-3">3. Yorgun Zihinle Çalışmak</h3>
                <p className="text-slate-600">
                  Psikomotor ve bilişsel yetenekler, yorgunluktan doğrudan etkilenir. İşten veya okuldan geldikten sonra, gece yarısı yapılan 1 saatlik verimsiz çalışma, zihninize yanlış paternleri kodlamanıza sebep olabilir. Kaliteli ve dinç bir zihinle yapılan 20 dakika, yorgun yapılan 2 saatten daha değerlidir.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Evde Hazırlık Yetersizliği */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Brain className="text-purple-600" size={32} />
              Evde Hazırlık Neden Yetersiz Kalır?
            </h2>
            
            <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200">
              <p className="text-lg text-slate-700 mb-6">
                Ev ortamı "güvenli"dir. Sınav ortamı ise "tehditkâr". Beynimiz güvenli ortamda farklı, stres altında farklı çalışır.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-red-100 p-1 rounded text-red-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Konfor Alanı Tuzağı</h4>
                    <p className="text-slate-600 text-sm">Evde istediğiniz zaman mola verebilir, dikkatiniz dağıldığında durabilirsiniz. Sınavda ise "pause" tuşu yoktur.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-red-100 p-1 rounded text-red-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Donanım Farklılıkları</h4>
                    <p className="text-slate-600 text-sm">Dokunmatik ekran, laptop touchpadi veya gaming mouse ile çalışmak sizi yanıltabilir. Sınavda standart, bazen eski tip ekipmanlar kullanılır. Hazırlığınızı mümkün olduğunca basit ve standart ekipmanlarla yapmalısınız.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-red-100 p-1 rounded text-red-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Gürültü ve Dikkat Dağıtıcılar</h4>
                    <p className="text-slate-600 text-sm">Evde sessiz ortamda çalışmaya alışmak risklidir. Sınav salonunda diğer adayların klavye sesleri, öksürükler veya sandalyelerin gıcırtısı dikkatinizi dağıtabilir.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Zaman Baskısı ve Multitasking */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Clock className="text-blue-600" size={32} />
              Kritik Faktörler: Zaman Baskısı ve Multitasking
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Stres Yönetimi</h3>
                <p className="text-slate-600">
                  Zaman daraldıkça beynin mantıksal işlem merkezi (prefrontal korteks) baskılanır ve duygusal tepkiler (amigdala) devreye girer. Hazırlık sürecinde kendinizi kasıtlı olarak zaman baskısına maruz bırakarak, bu paniği yönetmeyi öğrenmelisiniz.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Bilişsel Esneklik</h3>
                <p className="text-slate-600">
                  Pilotluk, aynı anda birden fazla veriyi işlemeyi gerektirir (Multitasking). Skytest modülleri, dikkatinizi bölerken performansınızı korumanızı ister. Tek bir göreve odaklanmak yerine, dikkatinizi hızla ve verimli bir şekilde görevler arasında kaydırma (Task Switching) yeteneğinizi geliştirmelisiniz.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Simülasyonun Gücü */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Target className="text-indigo-600" size={32} />
              Neden Profesyonel Simülasyonlarla Çalışmalısınız?
            </h2>
            
            <div className="prose prose-lg prose-slate max-w-none mb-8">
              <p>
                Amatör web siteleri veya basit mobil uygulamalar, testin sadece "görüntüsünü" taklit eder. Ancak profesyonel hazırlık platformları, testin "algoritmasını" ve "zorluk eğrisini" simüle eder.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-indigo-900 mb-6">CadetPrep Skytest Modülünün Avantajları</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="text-green-500 shrink-0" size={20} />
                  <span className="text-slate-700 font-medium">Gerçekçi Zorluk Algoritmaları</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="text-green-500 shrink-0" size={20} />
                  <span className="text-slate-700 font-medium">Performans Analitiği ve Geri Bildirim</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="text-green-500 shrink-0" size={20} />
                  <span className="text-slate-700 font-medium">Sınav Formatına Birebir Uygun Arayüz</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="text-green-500 shrink-0" size={20} />
                  <span className="text-slate-700 font-medium">Sınırsız Pratik İmkanı</span>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
              Hazırlığınızı Şansa Bırakmayın
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto relative z-10">
              Binlerce aday arasından sıyrılmak için doğru araçlarla, doğru şekilde çalışın. CadetPrep Skytest modülü ile sınav deneyimini bugünden yaşayın.
            </p>
            <button 
              onClick={() => onNavigate('SKYTEST_PRODUCT')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg relative z-10"
            >
              Hemen Hazırlanmaya Başla
              <ArrowRight size={20} />
            </button>
            <p className="mt-4 text-sm text-blue-200/80 relative z-10">
              *Ödeme sistemi çok yakında aktif olacaktır.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2024 CadetPrep Academy. Tüm hakları saklıdır.</p>
          <p className="text-sm text-slate-500">
            Yasal Uyarı: CadetPrep bağımsız bir hazırlık platformudur. Herhangi bir havayolu veya test merkezi (DLR, Skytest vb.) ile resmi bağlantısı yoktur.
          </p>
        </div>
      </footer>
    </div>
  );
};
