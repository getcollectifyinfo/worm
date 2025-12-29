import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, AlertTriangle, ShieldAlert, Scale, Info, CheckCircle } from 'lucide-react';

interface LegalDisclaimerPageProps {
  onBack: () => void;
}

export const LegalDisclaimerPage: React.FC<LegalDisclaimerPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Helmet>
        <title>Yasal Uyarı - CadetPrep Academy</title>
        <meta name="description" content="CadetPrep Academy yasal uyarı ve sorumluluk reddi beyanı." />
      </Helmet>

      {/* Header */}
      <nav className="bg-slate-900 text-white p-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
            Ana Sayfa
          </button>
          <div className="font-bold text-lg hidden md:block">CadetPrep Academy</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">YASAL UYARI</h1>
          <p className="text-xl text-slate-600 font-medium">(LEGAL DISCLAIMER)</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-12">
          
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Bağımsız Platform Beyanı</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              CadetPrep Academy, pilot adaylarının psikometrik ve bilişsel yetkinliklerini geliştirmeye yönelik bağımsız bir çevrim içi hazırlık ve simülasyon platformudur.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Bu platformda sunulan içerikler, simülasyonlar ve eğitim modülleri;
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-600">
              <li>herhangi bir havayolu şirketi,</li>
              <li>resmi test sağlayıcısı,</li>
              <li>sınav otoritesi</li>
              <li>veya üçüncü taraf kuruluş</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              ile doğrudan ya da dolaylı olarak bağlantılı değildir, onaylı değildir ve temsil etmez.
            </p>
          </section>

          <div className="h-px bg-slate-200 w-full" />

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Marka ve Ticari İsimler Hakkında</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              Bu platformda geçen SkyTest, Pegasus, DLR, Mollymawk ve benzeri marka, test veya kurum isimleri;
              yalnızca bilgilendirme ve referans amaçlı olarak kullanılmaktadır.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Tüm ticari markalar, test adları ve kurumsal isimler ilgili hak sahiplerine aittir.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-700 mb-2">CadetPrep Academy;</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>SkyTest’in resmi sağlayıcısı değildir,</li>
                <li>Pegasus Havayolları veya herhangi bir havayolu şirketi ile iş birliği içinde değildir,</li>
                <li>Resmi sınav veya değerlendirme süreci yürütmez.</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-slate-200 w-full" />

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Simülasyonlar Hakkında</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>Platformda sunulan simülasyonlar:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>gerçek sınav veya değerlendirme sistemlerinin birebir kopyası değildir,</li>
                <li>sınav sonucu, kabul veya başarının garantisi olarak yorumlanamaz,</li>
                <li>yalnızca adayların zihinsel becerilerini geliştirmeyi hedefleyen hazırlık amaçlı çalışmalardır.</li>
              </ul>
              <p className="mt-4 italic">
                Gerçek sınav içerikleri, formatları ve değerlendirme kriterleri; ilgili kurumlar tarafından zaman içinde değiştirilebilir.
              </p>
            </div>
          </section>

          <div className="h-px bg-slate-200 w-full" />

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Sorumluluk Reddi</h2>
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-slate-700">
              <p className="font-semibold mb-2">CadetPrep Academy;</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Kullanıcıların sınav sonuçlarından,</li>
                <li>Havayolu seçim süreçlerindeki değerlendirmelerden,</li>
                <li>Kabul, ret veya performans sonuçlarından</li>
              </ul>
              <p className="font-bold">sorumlu tutulamaz.</p>
              <p className="mt-4">
                Platformun kullanımı, tamamen kullanıcının kendi sorumluluğundadır.
              </p>
            </div>
          </section>

          <div className="h-px bg-slate-200 w-full" />

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Kabul Beyanı</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Bu platformu kullanan tüm kullanıcılar, yukarıda belirtilen şartları okuduğunu, anladığını ve kabul ettiğini beyan eder.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
