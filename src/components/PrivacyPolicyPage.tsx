import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Helmet>
        <title>Privacy - CadetPrep Academy</title>
        <meta name="description" content="CadetPrep Academy privacy policy and data security information." />
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
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Privacy</h1>
          <p className="text-lg text-slate-600">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">1. Genel Bilgilendirme</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy olarak gizliliğinize önem veriyoruz. Bu Gizlilik Politikası, platformumuzu kullandığınızda kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır. Hizmetlerimizi kullanarak, bu politikada belirtilen uygulamaları kabul etmiş olursunuz.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">2. Toplanan Bilgiler</h2>
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>Hizmetlerimizi sağlarken şu tür bilgileri toplayabiliriz:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Hesap Bilgileri:</strong> Kayıt olurken sağladığınız e-posta adresi ve şifre (şifrelenmiş olarak saklanır).</li>
                    <li><strong>Kullanım Verileri:</strong> Test performanslarınız, skorlarınız ve platformdaki etkinlikleriniz.</li>
                    <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgileri ve çerezler.</li>
                    <li><strong>Ödeme Bilgileri:</strong> Ödeme işlemleri Stripe gibi güvenli ödeme sağlayıcıları tarafından işlenir. Kredi kartı bilgileriniz sunucularımızda saklanmaz.</li>
                  </ul>
                </div>
              </section>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">3. Bilgilerin Kullanımı</h2>
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Hizmetlerimizi sunmak, sürdürmek ve iyileştirmek.</li>
                    <li>Test performansınızı analiz etmek ve size özel istatistikler sunmak.</li>
                    <li>Hesap güvenliğinizi sağlamak.</li>
                    <li>Yasal yükümlülükleri yerine getirmek.</li>
                  </ul>
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">4. Çerezler (Cookies)</h2>
                <p className="text-slate-600 leading-relaxed">
                  Platformumuzda oturumunuzu açık tutmak ve tercihlerinizi hatırlamak için çerezler kullanıyoruz. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman devre dışı bırakabilirsiniz, ancak bu durumda platformun bazı özellikleri çalışmayabilir.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">5. Üçüncü Taraf Hizmetler</h2>
                <p className="text-slate-600 leading-relaxed">
                  Hizmetlerimizi geliştirmek için Google Analytics, Supabase ve Stripe gibi güvenilir üçüncü taraf sağlayıcılarla çalışıyoruz. Bu sağlayıcıların kendi gizlilik politikaları geçerlidir.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">6. İletişim</h2>
                <p className="text-slate-600 leading-relaxed">
                  Gizlilik politikamızla ilgili sorularınız için bize şu adresten ulaşabilirsiniz: <a href="mailto:info@cadetprep.academy" className="text-blue-600 hover:underline">info@cadetprep.academy</a>
                </p>
              </section>
            </div>
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">1. General Information</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  CadetPrep Academy values your privacy. This Privacy Policy explains how we collect, use, and protect your personal data when you use our platform. By using our services, you agree to the practices described in this policy.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">2. Information Collected</h2>
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>We may collect the following types of information to provide our services:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Email address and password you provide during registration (stored securely as hashed).</li>
                    <li><strong>Usage Data:</strong> Test performance, scores, and activity on the platform.</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</li>
                    <li><strong>Payment Information:</strong> Payments are processed by secure providers like Stripe. Your card details are not stored on our servers.</li>
                  </ul>
                </div>
              </section>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">3. Use of Information</h2>
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To deliver, maintain, and improve our services.</li>
                    <li>To analyze your test performance and provide personalized statistics.</li>
                    <li>To ensure account security.</li>
                    <li>To comply with legal obligations.</li>
                  </ul>
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">4. Cookies</h2>
                <p className="text-slate-600 leading-relaxed">
                  We use cookies to keep your session active and remember your preferences. You can disable cookies from your browser settings, but some features of the platform may not function properly.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">5. Third-Party Services</h2>
                <p className="text-slate-600 leading-relaxed">
                  We work with trusted third-party providers such as Google Analytics, Supabase, and Stripe to enhance our services. Their respective privacy policies apply.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">6. Contact</h2>
                <p className="text-slate-600 leading-relaxed">
                  For questions regarding our privacy policy, you can reach us at: <a href="mailto:info@cadetprep.academy" className="text-blue-600 hover:underline">info@cadetprep.academy</a>
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
