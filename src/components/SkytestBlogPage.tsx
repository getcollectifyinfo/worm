import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, AlertTriangle, Brain, Target, Zap } from 'lucide-react';

interface SkytestBlogPageProps {
  onNavigate: (page: string) => void;
}

export const SkytestBlogPage: React.FC<SkytestBlogPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Helmet>
        <title>Skytest Nedir? Pegasus Cadet Adayları İçin Rehber - CadetPrep</title>
        <meta name="description" content="Skytest nedir? Pegasus cadet adayları için Skytest sınavı rehberi. Ölçülen beceriler, hazırlık taktikleri ve simülasyonun önemi hakkında detaylı bilgi." />
        <link rel="canonical" href="https://cadetprep.com/skytest-nedir" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "SkyTest nedir?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SkyTest, pilot adaylarının bilişsel yeteneklerini, dikkatini, çoklu görev becerisini ve psikomotor koordinasyonunu ölçmek için kullanılan bilgisayar tabanlı psikometrik testlerden oluşan bir sistemdir. Genellikle havayollarının cadet (yardımcı pilot adayı) seçim süreçlerinde yer alır."
                }
              },
              {
                "@type": "Question",
                "name": "Pegasus SkyTest nedir?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pegasus’un cadet seçim sürecinde adaylara uyguladığı test paketinin içinde SkyTest tabanlı modüller bulunabilir. Hangi testlerin, hangi sırayla ve hangi sürelerle uygulanacağı dönemsel olarak değişebilir; en güncel bilgi her zaman kurumun adaylara ilettiği dokümanlardadır."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest CASE ne demek?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CASE, “Cockpit Aptitude Screening Environment” ifadesinin kısaltmasıdır. Bu tek bir test değil; kokpit benzeri iş yükünü simüle eden, birden fazla testi içerebilen bir değerlendirme ortamı yaklaşımıdır. Bazı süreçlerde adaylar bu ortamda farklı görevleri aynı anda yürütmek zorunda kalır."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest sınavı ne kadar sürer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Süre, kurumun uyguladığı paket ve test kombinasyonuna göre değişir. Bazı süreçlerde testler kısa bloklar halinde, bazılarında daha uzun bir oturum şeklinde uygulanabilir. En doğru süre bilgisi, ilgili kurumun davet ve bilgilendirme metninde yer alır."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest’te hangi testler çıkıyor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Paketler kuruma göre değişse de genel olarak dikkat (vigilance), bölünmüş dikkat, bilgi işleme hızı, uzaysal algı/yön duygusu ve çoklu görev becerilerini ölçen test türleri görülür. CadetPrep Academy’de bu mantıklara benzer simülasyon modülleriyle pratik yapılabilir."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest zor mu?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SkyTest “zor” olmaktan çok “alışkanlık gerektiren” bir test türüdür. İlk kez giren adaylar komut temposu, zaman baskısı ve çoklu görev yapısı nedeniyle zorlanabilir. Düzenli pratik, özellikle tepki süresi ve hata oranını belirgin şekilde iyileştirir."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest’e nasıl hazırlanılır?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "En etkili hazırlık, test mantığını öğrenmek ve gerçek sınav temposuna benzer koşullarda tekrar yapmaktır. Önce Learn/Practice ile kuralları oturtup, ardından Mini Exam ile süre baskısını deneyimlemek iyi bir sıra olur. Pro seviyesinde ise daha uzun ve zor senaryolarla sınav dayanıklılığı geliştirilir."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest ücretsiz mi?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Resmî sınavlar kurum tarafından planlanır; “ücretsiz” olup olmaması süreç ve kurum politikasına bağlıdır. CadetPrep Academy ise adaylara bazı modüllerde sınırlı süreli ücretsiz deneme ve ücretsiz üyelikle erişim seçenekleri sunar."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest Türkiye’de nerede yapılıyor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Uygulama yeri kurumun belirlediği sınav merkezine, döneme ve organizasyona göre değişebilir. Türkiye’deki adaylar için en doğru lokasyon bilgisi, kurumun davet e-postası veya resmî bilgilendirme dokümanlarında yer alır."
                }
              },
              {
                "@type": "Question",
                "name": "SkyTest’te başarıyı en çok ne etkiler?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Doğruluk kadar tepki süresi de önemlidir. Bu yüzden yalnızca doğru yapmak değil, bunu zaman baskısı altında sürdürebilmek gerekir. Düzenli pratik ve gerçek tempo denemeleri, performansı en hızlı artıran iki faktördür."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Header / Navigation Bar (Simplified for Blog) */}
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
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-4">
            REHBER
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Skytest Nedir? <br className="hidden md:block" /> Pegasus Cadet Adayları İçin Rehber
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Pilotluk hayali kuran adaylar için en kritik eşiklerden biri olan Skytest sürecini, ölçülen becerileri ve başarı stratejilerini detaylıca inceledik.
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="w-full aspect-video bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl mb-12 flex items-center justify-center shadow-xl overflow-hidden relative">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
           <Brain size={64} className="text-white/80" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-slate max-w-none bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
          
          <p className="lead text-xl text-slate-800 font-medium leading-relaxed">
            Pilotluk hayali kuran pek çok aday için en kritik eşiklerden biri, havayolu şirketlerinin uyguladığı psikometrik test süreçleridir. Türkiye'de özellikle <strong>Pegasus Havayolları</strong>'nın cadet pilot alımlarında kullandığı <strong>Skytest</strong>, adayların bilişsel yeteneklerini, psikomotor becerilerini ve stres altındaki performanslarını ölçen kapsamlı bir değerlendirme sistemidir. Bu rehberde, Skytest'in ne olduğunu, hangi modüllerden oluştuğunu ve bu zorlu süreci başarıyla atlatmak için uygulamanız gereken stratejileri tüm detaylarıyla ele alacağız.
          </p>
          
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Brain size={20} /></span>
            Skytest Nedir?
          </h2>
          <p>
            Skytest, havacılık psikolojisi prensiplerine dayalı olarak geliştirilmiş, bilgisayar tabanlı bir yetenek test bataryasıdır. Adayların sadece akademik bilgilerini değil, aynı zamanda pilotluk mesleğinin gerektirdiği doğuştan gelen veya geliştirilebilir yeteneklerini analiz eder. Bu testler, DLR (Alman Havacılık ve Uzay Merkezi) sınavlarına benzerlik göstermekle birlikte, kendine özgü modülleri ve değerlendirme kriterleri ile ayrışır.
          </p>
          <p>
            Skytest sistemi, genellikle havayolu mülakat süreçlerinin ilk aşamalarından biri olarak karşınıza çıkar. İngilizce sınavını geçen adaylar, genellikle online veya yerinde yapılan bu teste davet edilirler. Sınavın temel amacı, adayın kokpit ortamındaki karmaşık görevleri yönetebilme potansiyelini (trainability) ölçmektir.
          </p>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Target size={20} /></span>
            Skytest Hangi Becerileri Ölçer?
          </h2>
          <p>Skytest sınavı tek bir yeteneğe odaklanmaz; aksine, kokpitte ihtiyaç duyulan çok yönlü becerileri sınar. İşte Skytest'in mercek altına aldığı temel yetkinlikler:</p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
            {[
              { 
                title: "Dikkat ve Konsantrasyon", 
                desc: "Uzun süre odaklanabilme, monoton görevlerde dikkati sürdürebilme ve dikkat dağıtıcı unsurlara (görsel/işitsel) rağmen ana görevi yerine getirebilme yeteneği." 
              },
              { 
                title: "Uzaysal Algı (Spatial Awareness)", 
                desc: "3 boyutlu düşünme, nesnelerin uzaydaki konumunu zihinsel olarak döndürebilme ve yön tayini yapabilme. Cube Rotation modülü bu yeteneğin en net ölçüldüğü testtir." 
              },
              { 
                title: "Psikomotor Koordinasyon", 
                desc: "El-göz-ayak koordinasyonu. Joystick ve pedallar (veya klavye/mouse) kullanarak ekrandaki objeleri kontrol etme becerisi. Hassas motor hareketleri gerektirir." 
              },
              { 
                title: "Çoklu Görev (Multitasking)", 
                desc: "Aynı anda birden fazla bilgi kaynağını takip edip doğru tepkileri verebilme. Örneğin, bir yandan irtifayı korurken diğer yandan matematik sorusu çözmek." 
              },
              { 
                title: "Bilgi İşleme Hızı", 
                desc: "Karmaşık verileri hızlıca analiz edip doğru kararı verme süresi. Havacılıkta kararsızlık en büyük risklerden biridir; Skytest bunu ölçer." 
              },
              { 
                title: "Matematik ve Fizik", 
                desc: "Temel havacılık problemlerini, hız-zaman-yol hesaplarını ve basit mekanik prensiplerini kalem-kağıt kullanmadan zihinden çözebilme yeteneği." 
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600"><AlertTriangle size={20} /></span>
            Skytest Neden Zorlayıcıdır?
          </h2>
          <p>
            Pek çok aday için Skytest, akademik sınavlardan çok daha zorlayıcı bulunur. Bunun birkaç temel nedeni vardır:
          </p>
          <ul className="space-y-2">
            <li><strong>Zaman Baskısı:</strong> Her soru için verilen süre genellikle "rahatça" çözmek için yetersizdir. Bu, adayın stres altındaki performansını ölçmek için kasıtlı yapılmıştır.</li>
            <li><strong>Yorgunluk Yönetimi:</strong> Testler arka arkaya gelir ve toplam süre uzundur. İlk modüldeki performansınızı son modüle kadar korumanız gerekir. Zihinsel dayanıklılık (Mental Endurance) burada devreye girer.</li>
            <li><strong>Adaptif Zorluk:</strong> Bazı modüller, siz doğru cevap verdikçe hızlanır veya zorlaşır. Bu, sizin maksimum kapasitenizi (limitlerinizi) görmek içindir. "Yapamıyorum" hissi yaratıp motivasyonunuzu düşürmeyi hedefler.</li>
          </ul>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><Check size={20} /></span>
            Skytest Sınavına Nasıl Hazırlanılır?
          </h2>
          <p className="mb-6">
            <a href="/skytest" onClick={(e) => { e.preventDefault(); onNavigate('SKYTEST_PRODUCT'); }} className="text-blue-600 hover:underline font-semibold">Skytest sınavı</a> bir zeka testi değildir; geliştirilebilir bir yetenek testidir. Doğru çalışma metodolojisi ile puanlarınızı %40-60 oranında artırabilirsiniz. İşte altın değerinde tavsiyeler:
          </p>
          
          <div className="space-y-6 not-prose">
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">1</div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Erken Başlayın ve Planlı Olun</h4>
                <p className="text-slate-600">Sınav tarihinden en az 3-4 hafta önce çalışmaya başlamak, beyin plastisitesinin gelişmesi için önemlidir. Son 3 günde yapılan "kamp" çalışmaları genellikle yetersiz kalır ve stresi artırır.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">2</div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Kısa ve Sık Çalışma Periyotları</h4>
                <p className="text-slate-600">Günde tek seferde 5 saat çalışmak yerine, sabah ve akşam 1'er saatlik odaklanmış seanslar yapın. Beyniniz dinlenirken öğrendiklerini işler. Uykunun öğrenmedeki rolünü unutmayın.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">3</div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Zayıf Yönlerinize Odaklanın</h4>
                <p className="text-slate-600">Genellikle adaylar iyi oldukları modülleri tekrar etmeyi severler (çünkü iyi hissettirir). Ancak asıl gelişim, en çok zorlandığınız ve düşük puan aldığınız modüllerin üzerine giderek sağlanır.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">4</div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Ortamı Simüle Edin</h4>
                <p className="text-slate-600">Evde çalışırken sessiz bir ortam sağlayın, telefonunuzu kapatın ve sınavdaymış gibi ciddiyetle testleri çözün. Mümkünse sınavda kullanacağınıza benzer bir mouse ve klavye kullanın.</p>
              </div>
            </div>
          </div>

          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-12">
            <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600"><Zap size={20} /></span>
            Gerçekçi Simülasyonun Önemi
          </h2>
          <p>
            Skytest, teorik bir sınavdan ziyade bir refleks ve yetenek sınavıdır. Bu nedenle, <strong>gerçekçi simülasyonlarla</strong> çalışmak hayati önem taşır. Sınav arayüzüne, butonların tepkisine, renk paletine ve zaman limitlerine aşina olmak, sınav günü yaşayacağınız "bilinmezlik stresini" ortadan kaldırır.
          </p>
          <p>
            Araştırmalar, sınav formatına aşina olan adayların, olmayanlara göre %30 daha az kaygı yaşadığını ve bunun doğrudan performansa yansıdığını göstermektedir. CadetPrep Academy olarak sunduğumuz modüller, Pegasus Skytest sürecindeki gerçek sınav dinamiklerini, zamanlamalarını ve algoritmalarını birebir yansıtacak şekilde tasarlanmıştır.
          </p>

          <hr className="my-12 border-slate-200" />

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-center text-white not-prose shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Pilotluk Kariyeriniz İçin İlk Adımı Atın</h3>
              <p className="mb-8 text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
                Rakiplerinizin önüne geçmek ve Skytest sürecini başarıyla tamamlamak için özel olarak hazırlanmış, gerçekçi simülasyon paketimizi hemen inceleyin.
              </p>
              <button 
                onClick={() => onNavigate('SKYTEST_PRODUCT')}
                className="px-10 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2"
              >
                Skytest Paketini İncele
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
          
          <hr className="my-12 border-slate-200" />

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sıkça Sorulan Sorular (SkyTest)</h2>
          <p className="text-slate-600 mb-8 italic text-sm">
            Aşağıdaki yanıtlar genel bilgilendirme amaçlıdır. SkyTest uygulaması ve kapsamı kurumlara göre değişebilir.
          </p>

          <div className="space-y-6 not-prose">
            {[
              {
                q: "SkyTest nedir?",
                a: "SkyTest, pilot adaylarının bilişsel yeteneklerini, dikkatini, çoklu görev becerisini ve psikomotor koordinasyonunu ölçmek için kullanılan bilgisayar tabanlı psikometrik testlerden oluşan bir sistemdir. Genellikle havayollarının cadet (yardımcı pilot adayı) seçim süreçlerinde yer alır."
              },
              {
                q: "Pegasus SkyTest nedir?",
                a: "Pegasus’un cadet seçim sürecinde adaylara uyguladığı test paketinin içinde SkyTest tabanlı modüller bulunabilir. Ama hangi testlerin, hangi sırayla ve hangi sürelerle uygulanacağı dönemsel olarak değişebilir; en güncel bilgi her zaman kurumun adaylara ilettiği dokümanlardadır."
              },
              {
                q: "SkyTest CASE ne demek?",
                a: "CASE, “Cockpit Aptitude Screening Environment” ifadesinin kısaltmasıdır. Bu, tek bir test değil; kokpit benzeri iş yükünü simüle eden, birden fazla testi içerebilen bir değerlendirme ortamı yaklaşımıdır. Bazı süreçlerde adaylar bu ortamda farklı görevleri aynı anda yürütmek zorunda kalır."
              },
              {
                q: "SkyTest sınavı ne kadar sürer?",
                a: "Süre, kurumun uyguladığı paket ve test kombinasyonuna göre değişir. Bazı süreçlerde testler kısa bloklar halinde, bazılarında daha uzun bir oturum şeklinde uygulanabilir. En doğru süre bilgisi, ilgili kurumun davet ve bilgilendirme metninde yer alır."
              },
              {
                q: "SkyTest’te hangi testler çıkıyor?",
                a: "Paketler kuruma göre değişse de genel olarak dikkat (vigilance), bölünmüş dikkat, bilgi işleme hızı, uzaysal algı/yön duygusu ve çoklu görev becerilerini ölçen test türleri görülür. CadetPrep Academy’de bu mantıklara benzer simülasyon modülleriyle pratik yapılabilir."
              },
              {
                q: "SkyTest zor mu?",
                a: "SkyTest “zor” olmaktan çok “alışkanlık gerektiren” bir test türüdür. İlk kez giren adaylar komut temposu, zaman baskısı ve çoklu görev yapısı nedeniyle zorlanabilir. Düzenli pratik, özellikle tepki süresi ve hata oranını belirgin şekilde iyileştirir."
              },
              {
                q: "SkyTest’e nasıl hazırlanılır?",
                a: "En etkili hazırlık, test mantığını öğrenmek ve gerçek sınav temposuna benzer koşullarda tekrar yapmaktır. Önce Learn/Practice ile kuralları oturtup, ardından Mini Exam ile süre baskısını deneyimlemek iyi bir sıra olur. Pro seviyesinde ise daha uzun ve zor senaryolarla sınav dayanıklılığı geliştirilir."
              },
              {
                q: "SkyTest ücretsiz mi?",
                a: "Resmî sınavlar kurum tarafından planlanır; “ücretsiz” olup olmaması süreç ve kurum politikasına bağlıdır. CadetPrep Academy ise adaylara bazı modüllerde sınırlı süreli ücretsiz deneme ve ücretsiz üyelikle erişim seçenekleri sunar."
              },
              {
                q: "SkyTest Türkiye’de nerede yapılıyor?",
                a: "Uygulama yeri kurumun belirlediği sınav merkezine, döneme ve organizasyona göre değişebilir. Türkiye’deki adaylar için en doğru lokasyon bilgisi, kurumun davet e-postası veya resmî bilgilendirme dokümanlarında yer alır."
              },
              {
                q: "SkyTest’te başarıyı en çok ne etkiler?",
                a: "Doğruluk kadar tepki süresi de önemlidir. Bu yüzden yalnızca “doğru yapmak” değil, bunu zaman baskısı altında sürdürebilmek gerekir. Düzenli pratik ve gerçek tempo denemeleri, performansı en hızlı artıran iki faktördür."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Soru {idx + 1}: {item.q}</h3>
                <p className="text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-8 bg-blue-50 rounded-2xl border border-blue-100 text-center not-prose">
            <h4 className="text-xl font-bold text-slate-900 mb-3">SkyTest mantığını uygulamalı görmek ister misin?</h4>
            <p className="text-slate-600 mb-6">SkyTest simülasyonlarında ücretsiz deneme ile başlayabilirsin.</p>
            <button 
              onClick={() => onNavigate('SKYTEST_UCRETSIZ')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              SkyTest Ücretsiz Denemeyi Başlat
            </button>
          </div>

        </article>

        {/* Legal Disclaimer */}
        <div className="mt-12 p-6 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-sm text-center">
          <p>
            <strong>Yasal Bilgilendirme:</strong> CadetPrep Academy, bağımsız bir hazırlık platformudur ve herhangi bir havayolu şirketi veya resmi test organizasyonu (Skytest® vb.) ile resmi bir bağı yoktur. Sunulan içerikler, adayların kişisel gelişimine yönelik hazırlık amaçlıdır.
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
