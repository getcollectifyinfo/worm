import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, FileText, Scale, ShieldCheck, AlertCircle } from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Helmet>
        <title>Kullanım Şartları - CadetPrep Academy</title>
        <meta name="description" content="CadetPrep Academy kullanım şartları ve hizmet sözleşmesi." />
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
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Kullanım Şartları / Terms and Conditions</h1>
          <p className="text-lg text-slate-600">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Turkish Section */}
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">1. Kabul Edilme</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy'ye ("Platform") erişerek veya kullanarak, bu Kullanım Şartları'nı ("Şartlar") okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı kabul ettiğinizi beyan edersiniz. Bu şartları kabul etmiyorsanız, lütfen Platformu kullanmayınız.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">2. Hizmet Kullanımı</h2>
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>Platformu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Hesap güvenliğinizi sağlamak sizin sorumluluğunuzdadır.</li>
                    <li>Platformu yasa dışı veya yetkisiz bir amaçla kullanamazsınız.</li>
                    <li>Diğer kullanıcıların deneyimini olumsuz etkileyecek davranışlarda bulunamazsınız.</li>
                    <li>Platformun kaynak kodlarına erişmeye veya tersine mühendislik yapmaya çalışamazsınız.</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">3. Fikri Mülkiyet</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy üzerindeki tüm içerik, tasarımlar, grafikler, test modülleri ve yazılımlar CadetPrep Academy'nin mülkiyetindedir ve telif hakkı yasaları ile korunmaktadır. İzinsiz kopyalanması, dağıtılması veya ticari amaçla kullanılması yasaktır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">4. Ödemeler ve İadeler</h2>
                <p className="text-slate-600 leading-relaxed">
                  Ücretli hizmetler için yapılan ödemeler kesindir. Dijital içerik ve hizmetler sunulduğu için, aksi belirtilmedikçe veya yasal bir zorunluluk olmadıkça iade yapılmamaktadır. Aboneliklerinizi dilediğiniz zaman iptal edebilirsiniz; iptal işlemi bir sonraki fatura döneminde geçerli olur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">5. Sorumluluk Reddi</h2>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy, sunulan test simülasyonlarının gerçek sınavlarla birebir aynı olacağını garanti etmez. Platform, bir hazırlık aracı olarak tasarlanmıştır. Herhangi bir havayolu veya resmi kurumla doğrudan bağlantısı yoktur. Sınav başarı garantisi verilmemektedir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">6. Değişiklikler</h2>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy, bu Kullanım Şartları'nı dilediği zaman güncelleme hakkını saklı tutar. Değişiklikler Platformda yayınlandığı andan itibaren geçerli olur. Güncellemeleri takip etmek kullanıcının sorumluluğundadır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">7. İletişim</h2>
                <p className="text-slate-600 leading-relaxed">
                  Bu şartlarla ilgili sorularınız için bize şu adresten ulaşabilirsiniz: <a href="mailto:info@cadetprep.academy" className="text-blue-600 hover:underline">info@cadetprep.academy</a>
                </p>
              </section>
            </div>

            {/* English Section */}
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">1. Acceptance</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  By accessing or using CadetPrep Academy ("Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these terms, please do not use the Platform.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">2. Use of Service</h2>
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>You agree to comply with the following rules when using the Platform:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You are responsible for maintaining the security of your account.</li>
                    <li>You may not use the Platform for any illegal or unauthorized purpose.</li>
                    <li>You may not engage in behavior that negatively affects the experience of other users.</li>
                    <li>You may not attempt to access the Platform's source code or reverse engineer it.</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">3. Intellectual Property</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  All content, designs, graphics, test modules, and software on CadetPrep Academy are the property of CadetPrep Academy and are protected by copyright laws. Unauthorized copying, distribution, or commercial use is prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">4. Payments and Refunds</h2>
                <p className="text-slate-600 leading-relaxed">
                  Payments made for paid services are final. Since digital content and services are provided, refunds are not made unless otherwise stated or legally required. You can cancel your subscriptions at any time; the cancellation will take effect in the next billing period.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">5. Disclaimer</h2>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy does not guarantee that the test simulations provided will be identical to real exams. The Platform is designed as a preparation tool. It has no direct connection with any airline or official institution. No guarantee of exam success is given.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">6. Changes</h2>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy reserves the right to update these Terms of Service at any time. Changes become effective immediately upon posting on the Platform. It is the user's responsibility to follow updates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">7. Contact</h2>
                <p className="text-slate-600 leading-relaxed">
                  For questions regarding these terms, you can reach us at: <a href="mailto:info@cadetprep.academy" className="text-blue-600 hover:underline">info@cadetprep.academy</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <div className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 mt-12">
        © {new Date().getFullYear()} CadetPrep Academy. Tüm hakları saklıdır.
      </div>
    </div>
  );
};
