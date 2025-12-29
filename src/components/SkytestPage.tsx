import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Check, 
  ChevronRight, 
  X, 
  Brain, 
  Clock, 
  Activity, 
  Target,
  Plane,
  ArrowRight
} from 'lucide-react';

import type { Page } from '../types';

import { GameScreenshotSlider } from './GameScreenshotSlider';
import { useGameAccess } from '../hooks/useGameAccess';
import { ProAccessModal } from './ProAccessModal';

interface SkytestPageProps {
  onBack: () => void;
  onStartFree: () => void;
  onNavigate: (page: Page) => void;
}

const MODULES = [
  {
    id: 'cube',
    name: 'Cube Rotation Pro',
    shortDesc: 'Uzaysal algı ve 3 boyutlu düşünme becerilerini geliştirmeye yönelik zihinsel rotasyon simülasyonu.',
    fullDesc: 'Cube Rotation Pro, pilot adaylarının 3 boyutlu nesneleri zihinlerinde manipüle etme yeteneğini test eder. Küplerin uzaydaki hareketlerini takip ederek son pozisyonlarını veya yönelimlerini doğru tahmin etmeniz gerekir. Bu modül, kokpit göstergelerini ve uçağın uzaydaki konumunu hızlıca yorumlamak için kritik olan uzaysal farkındalığı artırır.',
    measures: [
      '3 Boyutlu Düşünme',
      'Uzaysal Algı ve Yönelim',
      'Zihinsel Rotasyon Hızı'
    ]
  },
  {
    id: 'cap',
    name: 'Flight Capacity (CAP)',
    shortDesc: 'Aynı anda birden fazla görevi yönetme ve psikomotor koordinasyonu ölçen multitasking simülasyonu.',
    fullDesc: 'Flight Capacity (CAP) modülü, kokpit ortamındaki yüksek iş yükünü simüle eder. Adaydan aynı anda irtifa, hız ve yön gibi parametreleri takip etmesi, işitsel uyaranlara tepki vermesi ve basit matematiksel işlemleri çözmesi istenir. Bu test, stres altında karar verme ve önceliklendirme becerilerini ölçer.',
    measures: [
      'Multitasking (Çoklu Görev)',
      'Psikomotor Koordinasyon',
      'Seçici Dikkat',
      'Stres Yönetimi'
    ]
  },
  {
    id: 'capacity',
    name: 'Capacity Test',
    shortDesc: 'Uçuş kontrolü ve görsel dikkat görevlerini aynı anda yürütmeye dayalı çoklu görev testi.',
    fullDesc: 'Capacity Test, görsel dikkati ve motor becerileri birleştirir. Bir yandan hareketli bir nesneyi merkezde tutmaya çalışırken, diğer yandan ekranda beliren şekil veya renk değişikliklerine anında tepki vermeniz gerekir. Bölünmüş dikkat kapasitenizi ve sürekli dikkat performansınızı zorlar.',
    measures: [
      'Bölünmüş Dikkat',
      'Sürekli Dikkat',
      'El-Göz Koordinasyonu'
    ]
  },
  {
    id: 'vigi',
    name: 'VIGI Test',
    shortDesc: 'Görsel ve işitsel dikkat ile tepki süresini ölçen çift görevli simülasyon.',
    fullDesc: 'VIGI Testi, uyanıklık (vigilance) seviyenizi ölçer. Uzun süreli monoton görevler sırasında dikkatinizi korumanız gerekir. Nadiren gerçekleşen görsel veya işitsel sinyalleri yakalamanız ve yanlış alarmları (false positives) ayırt etmeniz istenir. Bu modül, uzun uçuşlardaki dikkat sürdürülebilirliğini simüle eder.',
    measures: [
      'Uyanıklık (Vigilance)',
      'Tepki Süresi',
      'İşitsel ve Görsel Ayrıştırma'
    ]
  },
  {
    id: 'ipp',
    name: 'IPP Test',
    shortDesc: 'Bilgi işleme hızı, dikkat ve zihinsel aritmetik yeteneklerini ölçen simülasyon.',
    fullDesc: 'IPP (Information Processing Performance) modülü, bilişsel işlem hızınızı test eder. Karmaşık kurallara dayalı sayısal ve görsel verileri hızlıca analiz edip doğru çıktıyı üretmeniz gerekir. Çalışma belleğini (working memory) aktif olarak kullanmayı gerektirir.',
    measures: [
      'Bilgi İşleme Hızı',
      'Çalışma Belleği',
      'Zihinsel Aritmetik',
      'Mantıksal Çıkarım'
    ]
  },
  {
    id: 'vigi2',
    name: 'VIGI 2',
    shortDesc: 'Yön, hız, şekil ve renk değişimlerini anlık fark etmeye dayalı dinamik takip testi.',
    fullDesc: 'VIGI 2, görsel dikkatin dinamik bir versiyonudur. Hareket halindeki nesnelerin özelliklerindeki (yön, hız, renk, şekil) ince değişiklikleri fark etmeniz gerekir. Bu test, görsel tarama ve değişim körlüğü (change blindness) direncini ölçer.',
    measures: [
      'Görsel Tarama',
      'Dinamik Dikkat',
      'Detay Farkındalığı'
    ]
  },
  {
    id: 'worm',
    name: 'Spatial Worm 2D',
    shortDesc: 'Yön komutlarını zihinsel olarak takip etmeye ve doğru rotayı seçmeye dayalı uzaysal algı simülasyonu.',
    fullDesc: 'Spatial Worm 2D, sürekli değişen yön komutlarını zihninizde birleştirerek bir rotayı takip etmenizi ister. "Sağ", "Sol", "İleri" gibi komutları, o anki yöneliminize göre (egocentric vs allocentric) doğru yorumlamanız gerekir. Uzaysal yönelim yeteneğini en saf haliyle test eder.',
    measures: [
      'Uzaysal Yönelim',
      'Zihinsel Haritalama',
      'Komut İşleme Hızı'
    ]
  }
];

export const SkytestPage: React.FC<SkytestPageProps> = ({ onBack, onStartFree, onNavigate }) => {
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLegalAccepted, setIsLegalAccepted] = useState(false);
  const { tier, canAccessModule, showProModal, openProModal, closeProModal } = useGameAccess();

  const handleBuy = async () => {
    if (!isLegalAccepted) {
      alert('Lütfen satın alma işlemine devam etmek için Yasal Uyarıyı okuyup kabul ediniz.');
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No payment URL returned', data);
        alert('Ödeme sistemi şu an yanıt vermiyor. Lütfen daha sonra tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Bir hata oluştu. Lütfen bağlantınızı kontrol ediniz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Helmet>
        <title>SKYTEST Hazırlık - Pegasus Psikometrik Test Simülasyonu</title>
        <meta name="description" content="SKYTEST hazırlık modülleri ile Pegasus pilotluk sınavlarına hazırlanın. DLR, matematik, fizik ve dikkat testleri simülasyonu. Cadet adayları için özel psikometrik testler." />
      </Helmet>
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full z-20 p-6">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ChevronRight className="rotate-180" size={20} />
                Ana Sayfa
            </button>
        </nav>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium">
                <Plane size={16} />
                <span>Pilot Adayları İçin Özel</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                SKYTEST Psikometrik <span className="text-blue-400">Simülasyonu</span>
              </h1>
              
              <h2 className="text-xl md:text-2xl text-slate-300 font-light">
                Pegasus Havayolları cadet seçim sürecinde kullanılan test stiline hazırlık
              </h2>
              
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                SKYTEST, pilot adaylarının dikkat, tepki süresi ve çoklu görev becerilerini ölçen ve geliştiren simülasyonlardan oluşur.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={onStartFree}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  Ücretsiz Dene
                  <ChevronRight size={20} />
                </button>
                <button 
                  onClick={handleBuy}
                  disabled={isLoading}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      İşleniyor...
                    </>
                  ) : (
                    '500 TL / Ay – Satın Al'
                  )}
                </button>
              </div>
            </div>

            {/* Visuals (Placeholder for screenshots) */}
            <div className="w-full md:w-1/2">
              <GameScreenshotSlider />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SKYTEST NEDİR? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
          <h2 className="text-3xl font-bold text-slate-900">SKYTEST Nedir?</h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              SKYTEST, havacılık psikolojisi prensiplerine dayanarak geliştirilmiş, pilot adaylarını zorlu seçim süreçlerine hazırlayan kapsamlı bir eğitim aracıdır. Sadece testleri çözmeyi değil, beyninizin bu testlerin gerektirdiği bilişsel süreçlere adapte olmasını sağlar.
            </p>
            <p>
              Simülasyonlarımız, <strong>gerçek sınav temposunu</strong> ve <strong>zaman baskısını</strong> birebir yansıtacak şekilde tasarlanmıştır. Adayların sadece doğru cevabı bulması değil, bunu yoğun stres ve dikkat dağıtıcı unsurlar altında, sürdürülebilir bir performansla yapması hedeflenir.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">Zaman Baskısı</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">Multitasking</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">Odaklanma</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">Bilişsel Güç</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MODÜLLER (Cards) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Eğitim Modülleri</h2>
            <p className="text-slate-600 mt-4">Seçim süreçlerinde karşılaşacağınız tüm test bataryaları</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {MODULES.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 flex flex-col h-full group relative">
                {/* Card Thumbnail */}
                <div className="h-40 bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full bg-slate-800 opacity-10"></div>
                    {/* Placeholder Icon */}
                    <Brain size={48} className="absolute opacity-20" />
                  </div>
                  <div className="absolute bottom-3 left-4">
                     <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wider">
                       Simülasyon
                     </span>
                  </div>
                  {tier === 'GUEST' && !canAccessModule(module.id) && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center text-slate-800 font-bold text-sm">
                      Pro ile açılır
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{module.name}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow">
                    {module.shortDesc}
                  </p>
                  <button 
                    onClick={() => {
                      if (tier === 'GUEST' && !canAccessModule(module.id)) {
                        openProModal();
                      } else {
                        setSelectedModule(module);
                      }
                    }}
                    className="w-full py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Detayları Gör
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KİMLER İÇİN? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">Bu Paket Kimler İçin Uygun?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Pegasus Havayolları cadet adayları",
                "Psikometrik testlerde hız/odak sorunu yaşayanlar",
                "Gerçek sınav öncesi birebir prova yapmak isteyenler",
                "Dikkat ve multitasking becerilerini geliştirmek isteyenler"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-lg text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section id="pricing" className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Hemen Hazırlanmaya Başla</h2>
          
          <div className="max-w-md mx-auto bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-4 py-1 rounded-bl-xl text-white">
              POPÜLER
            </div>

            <h3 className="text-2xl font-bold mb-2">SKYTEST Paketi</h3>
            <div className="flex items-baseline justify-center gap-1 my-6">
              <span className="text-5xl font-extrabold text-white">500</span>
              <span className="text-xl text-slate-400">TL / Ay</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-sm text-slate-400">Tüm modüllere sınırsız erişim</p>
              <p className="text-xs text-slate-500 italic">Şu anda yalnızca SKYTEST paketi aktiftir.</p>
              
              <div className="flex items-start justify-center gap-2 text-left pt-2">
                <input 
                  type="checkbox" 
                  id="legal-check" 
                  checked={isLegalAccepted}
                  onChange={(e) => setIsLegalAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="legal-check" className="text-xs text-slate-400 select-none cursor-pointer">
                  <span className="text-slate-300 font-medium">Yasal Uyarıyı</span> okudum, anladım ve kabul ediyorum.
                  <br />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('LEGAL_DISCLAIMER');
                    }}
                    className="text-blue-400 hover:text-blue-300 underline mt-1"
                  >
                    Yasal Uyarıyı Oku
                  </button>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleBuy}
                disabled={isLoading || !isLegalAccepted}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  'Hemen Satın Al'
                )}
              </button>
              <button 
                onClick={onStartFree}
                className="w-full py-3 text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                Veya Ücretsiz Dene
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMING SOON */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Yakında Gelecek Paketler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "DLR Paketi", desc: "Lufthansa & THY süreçleri için" },
              { name: "Mollymawk", desc: "SunExpress süreçleri için" },
              { name: "All in One", desc: "Tüm hazırlık modülleri tek pakette" }
            ].map((pack, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-800">{pack.name}</h3>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    ÇOK YAKINDA
                  </span>
                </div>
                <p className="text-sm text-slate-500">{pack.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG LINKS */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Skytest Hakkında Merak Edilenler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => onNavigate('SKYTEST_BLOG_1')}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
            >
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Skytest Nedir?</h3>
              <p className="text-sm text-slate-500">Kapsamlı rehber ve detaylar.</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Devamını Oku <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button 
              onClick={() => onNavigate('SKYTEST_PREPARATION_BLOG')}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
            >
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Skytest Sınavına Nasıl Hazırlanılır?</h3>
              <p className="text-sm text-slate-500">Gerçekçi hazırlık yöntemleri.</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Devamını Oku <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button 
              onClick={() => onNavigate('SKYTEST_PEGASUS_BLOG')}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
            >
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Pegasus Cadet Sürecinde Skytest</h3>
              <p className="text-sm text-slate-500">Süreç ve gereklilikler.</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Devamını Oku <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 7. SEO CONTENT & FAQ */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Skytest Hazırlık ve Simülasyon Rehberi</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                    <strong>Skytest hazırlık</strong> süreci, pilot adaylarının en çok zorlandığı aşamalardan biri olan psikometrik testler için kritik bir öneme sahiptir. Özellikle <strong>Pegasus</strong> gibi havayolu şirketlerinin cadet alımlarında kullandığı <strong>skytest sınavı</strong>, adayların bilişsel yeteneklerini, dikkat sürdürülebilirliğini ve stres altındaki performansını ölçer. Platformumuz, bu zorlu sürece yönelik geliştirdiği <strong>skytest psikometrik test</strong> simülasyonları ile adaylara gerçek sınav deneyimi sunar.
                </p>
                <p>
                    <strong>Skytest Pegasus</strong> modülleri ile uyumlu olan sistemimiz, görsel hafıza, üç boyutlu düşünme, matematiksel işlem hızı ve çoklu görev (multitasking) becerilerinizi geliştirmenize yardımcı olur. Skytest sınavı hazırlık aşamasında karşılaşacağınız Cube Rotation, Flight Capacity ve VIGI gibi testler, sadece doğru cevabı bulmanızı değil, aynı zamanda hız ve doğruluğu dengede tutmanızı gerektirir.
                </p>
                <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-4">Neden Skytest Hazırlık Simülasyonu?</h3>
                <p>
                    Pilotluk mesleği, yüksek düzeyde durumsal farkındalık ve hızlı karar verme yetisi gerektirir. Skytest simülasyonlarımız, bu yetileri ölçen standart test bataryalarının birebir kopyası niteliğindedir. Düzenli pratik yaparak, zihinsel dayanıklılığınızı artırabilir ve gerçek sınavdaki performans kaygısını minimize edebilirsiniz. Skytest Pegasus süreçlerinde başarılı olmak için sadece teorik bilgi değil, pratik ve psikomotor beceriler de büyük önem taşır.
                </p>
                <p>
                    Platformumuzdaki modüller, havacılık psikolojisi uzmanları tarafından analiz edilerek oluşturulmuştur. Her bir skytest psikometrik test modülü, sınavda karşınıza çıkabilecek farklı zorluk seviyelerini içerir. Böylece, skytest hazırlık sürecinizi adım adım ilerleterek, eksik olduğunuz alanları tespit edip geliştirebilirsiniz. Unutmayın, skytest sınavı bir zeka testi değil, bir yetenek ve performans testidir; doğru çalışma yöntemiyle geliştirilebilir.
                </p>
            </div>
        </div>
      </section>
      
      {/* Disclaimer Footer */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
                CadetPrep Academy, bağımsız bir hazırlık platformudur. SkyTest, Pegasus ve diğer tüm ticari markalar ilgili hak sahiplerine aittir. 
                Platform, herhangi bir havayolu veya resmi test sağlayıcısı ile bağlantılı değildir. 
                <button 
                    onClick={() => onNavigate('LEGAL_DISCLAIMER')}
                    className="text-slate-600 hover:text-slate-800 underline ml-1 font-medium"
                >
                    Detaylı Yasal Uyarı
                </button>
            </p>
        </div>
      </section>

      <footer className="py-12 bg-[#050914] text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            CadetPrep Academy, bağımsız bir hazırlık platformudur. Herhangi bir havayolu şirketi veya resmi test organizasyonu ile bağlantılı değildir.
          </p>
          <div className="mt-4 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} CadetPrep Academy. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      {/* MODULE DETAIL MODAL */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{selectedModule.name}</h3>
              <button 
                onClick={() => setSelectedModule(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
              {/* Large Screenshot Placeholder */}
              <div className="w-full aspect-video bg-slate-900 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-slate-900/40"></div>
                <Activity size={48} className="text-white/20" />
                <span className="text-white/40 font-mono text-sm mt-2 ml-2">HD PREVIEW</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Modül Hakkında</h4>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedModule.fullDesc}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Bu Modül Neyi Ölçer?</h4>
                  <ul className="space-y-3">
                    {selectedModule.measures.map((m, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => {
                  if (tier === 'GUEST' && !canAccessModule(selectedModule.id)) {
                    openProModal();
                  } else {
                    setSelectedModule(null);
                    onStartFree();
                  }
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Bu Modülü Dene
              </button>
            </div>
          </div>
        </div>
      )}
      <ProAccessModal isOpen={showProModal} onClose={closeProModal} onUpgrade={handleUpgrade} />
    </div>
  );
};
