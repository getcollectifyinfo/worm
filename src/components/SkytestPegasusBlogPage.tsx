import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Brain, Target, Zap, TrendingUp, ShieldAlert } from 'lucide-react';

interface SkytestPegasusBlogPageProps {
  onNavigate: (page: string) => void;
}

export const SkytestPegasusBlogPage: React.FC<SkytestPegasusBlogPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Helmet>
        <title>Pegasus Cadet Seçim Sürecinde Skytest Rehberi - CadetPrep</title>
        <meta name="description" content="Pegasus cadet pilot seçim sürecinde uygulanan Skytest benzeri psikometrik testler, zorluklar ve hazırlık stratejileri hakkında kapsamlı rehber." />
        <link rel="canonical" href="https://cadetprep.com/skytest-pegasus" />
      </Helmet>

      {/* Header / Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 font-bold text-xl text-slate-900 cursor-pointer"
            onClick={() => onNavigate('MARKETING')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <span>CadetPrep</span>
          </div>
          <button 
            onClick={() => onNavigate('SKYTEST_PRODUCT')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Paketleri İncele
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Article Header */}
        <header className="mb-12 text-center">
          <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold tracking-wide mb-4">
            PEGASUS SÜRECİ
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Pegasus Cadet Seçim Sürecinde <br className="hidden md:block" /> Skytest Gerçeği
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Pegasus Havayolları'nın pilot alım süreçlerinde karşılaşılan psikometrik zorlukları, Skytest metodolojisini ve başarıya giden yolu analiz ettik.
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="w-full aspect-video bg-gradient-to-tr from-yellow-500 to-orange-600 rounded-2xl mb-12 flex items-center justify-center shadow-xl overflow-hidden relative">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
           <Target size={64} className="text-white/90" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-slate max-w-none bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
          
          <p className="lead text-xl text-slate-800 font-medium leading-relaxed">
            Pegasus Havayolları, dinamik büyüme stratejisi ve genç filosuyla Türkiye'nin önde gelen havayolu şirketlerinden biridir. Pilot adayları (Cadet) için uyguladıkları seçim süreci, en az eğitim süreci kadar titiz ve zorludur. Bu sürecin en kritik virajlarından biri, adayların bilişsel ve psikomotor yeteneklerinin sınandığı aşamadır. Sıklıkla <strong>Skytest</strong> benzeri modüllerle gerçekleştirilen bu değerlendirmeler, adayların kokpit uyumunu belirlemede hayati rol oynar.
          </p>
          
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Brain size={20} /></span>
            Seçim Sürecinde Psikometrik Testlerin Rolü
          </h2>
          <p>
            Havayolu şirketleri için bir pilot adayının sadece "uçmayı bilmesi" veya "akademik başarısı" yeterli değildir. Kritik anlarda doğru karar verebilme, stres altında soğukkanlılığını koruyabilme ve aynı anda birden fazla veriyi işleyebilme (multitasking) yeteneği çok daha değerlidir.
          </p>
          <p>
            Pegasus sürecindeki testler tam olarak bu "potansiyeli" ölçmeyi hedefler. Amaç, eğitimi başarıyla tamamlayıp tamamlayamayacağınızı değil, <strong>iyi bir pilot olup olamayacağınızı</strong> öngörmektir. Bu testler, bir nevi "kokpit simülasyonu" işlevi görür ve elenme oranlarının en yüksek olduğu aşamalardan biridir.
          </p>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><Target size={20} /></span>
            Skytest Benzeri Test Yaklaşımları
          </h2>
          <p>
            Süreçte kullanılan test bataryaları genellikle Skytest veya DLR-1 modülleriyle büyük benzerlikler gösterir. Karşınıza çıkması muhtemel temel modüller şunlardır:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
            {[
              { 
                title: "Görsel Hafıza (Visual Memory)", 
                desc: "Kısa süreli görsel bilgileri akılda tutma ve geri çağırma yeteneği. Göstergeleri ve sayıları hızlıca ezberleyip hatırlamanız beklenir." 
              },
              { 
                title: "Algısal Hız (Perceptual Speed)", 
                desc: "Kadranları, göstergeleri ve yönlendirmeleri saniyeler içinde okuyup doğru tepkiyi verme hızı." 
              },
              { 
                title: "Küp Çevirme (Cube Rotation)", 
                desc: "Uzaysal farkındalığın en temel testi. Bir küpün 3 boyutlu uzayda hareketini zihinsel olarak takip etme becerisi." 
              },
              { 
                title: "Konsantrasyon", 
                desc: "Uzun süreli ve monoton görevlerde dikkati kaybetmeden, değişen kurallara (örneğin renk/şekil değişimleri) adapte olabilme." 
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-yellow-200 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle size={20} /></span>
            Adaylar Neden Bu Testlerde Zorlanır?
          </h2>
          <p>
            Pek çok aday, akademik geçmişleri çok parlak olsa bile bu aşamada elenebilmektedir. Bunun temel nedenleri şunlardır:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              <span><strong>Alışılmadık Format:</strong> Hayatımız boyunca girdiğimiz testler (ÖSS, YDS vb.) bilgi ölçmeye dayalıdır. Bu testler ise "işlemci hızını" ve "RAM kapasitesini" ölçer. Beynimiz bu formata antrenmanlı değildir.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              <span><strong>Yapay Stres:</strong> Testler, kasıtlı olarak zaman baskısı yaratacak ve hata yapmaya zorlayacak şekilde tasarlanmıştır. Panikleyen aday kaybeder.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              <span><strong>Yanlış Hazırlık:</strong> Sadece video izlemek veya okumak bu yetenekleri geliştirmez. "Kas hafızası" gibi "zihin hafızası" oluşturmak için aktif pratik gerekir.</span>
            </li>
          </ul>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><TrendingUp size={20} /></span>
            Nasıl Hazırlanmak Gerekir?
          </h2>
          <p>
            Pegasus sürecine hazırlanırken stratejik olmak zorundasınız. İşte CadetPrep uzmanlarından öneriler:
          </p>

          <div className="space-y-6 mt-8 not-prose">
            <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <Zap size={18} /> Düzenli Nöro-Antrenman
              </h4>
              <p className="text-green-800 text-sm">Günde 20 dakika ile başlayıp süreyi kademeli artırın. Beyninizin yeni sinir ağları oluşturması zaman alır. Sabah saatleri bilişsel antrenman için en verimli zamandır.</p>
            </div>
            
            <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <ShieldAlert size={18} /> Hata Yönetimi
              </h4>
              <p className="text-green-800 text-sm">Hata yaptığınızda duraksamayın veya moralinizi bozmayın. Sistem toparlanma hızınızı (recovery speed) da ölçer. Bir hata yaptığınızda hemen sonraki soruya %100 odaklanın.</p>
            </div>

            <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <Target size={18} /> Simülasyon Kalitesi
              </h4>
              <p className="text-green-800 text-sm">Çalıştığınız platformun gerçek sınav dinamiklerini yansıtması kritiktir. Yanlış mekaniklerle çalışmak, sınavda negatif transfer (yanlış alışkanlık) yaşamanıza neden olabilir.</p>
            </div>
          </div>

          <p className="mt-8">
            Unutmayın, bu testler zeka seviyenizi değil, belirli görevlere yatkınlığınızı ölçer. Yatkınlık ise doğru antrenmanla geliştirilebilir bir kas gibidir.
          </p>

          <hr className="my-12 border-slate-200" />

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl p-8 md:p-12 text-center text-white not-prose shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Pegasus Sürecine Hazır Mısınız?</h3>
              <p className="mb-8 text-yellow-50 max-w-2xl mx-auto text-lg leading-relaxed">
                <a href="/skytest" onClick={(e) => { e.preventDefault(); onNavigate('SKYTEST_PRODUCT'); }} className="text-white underline hover:text-yellow-100 font-semibold">Skytest çalışma paketi</a> ile pratik yaparak yeteneklerinizi geliştirin ve rakiplerinizden bir adım öne geçin.
              </p>
              <button 
                onClick={() => onNavigate('SKYTEST_PRODUCT')}
                className="px-10 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2"
              >
                Hazırlık Paketini İncele
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>

        </article>

        {/* Legal Disclaimer */}
        <div className="mt-12 p-6 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-sm text-center">
          <p>
            <strong>Yasal Bilgilendirme:</strong> Bu içerik ve CadetPrep Academy, Pegasus Havayolları veya Skytest® ile resmi veya ticari bir bağlantıya sahip değildir. Sunulan bilgiler, genel havacılık mülakat süreçlerine dair kamuya açık kaynaklardan derlenmiş rehber niteliğindedir.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center border-t border-slate-800">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CadetPrep Academy. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
};
