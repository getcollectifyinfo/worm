import React, { useState } from 'react';
import { Mail, Send, User, MessageSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Genel',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use API path. In dev it might need localhost if not proxying, but usually /api works with Vercel or Vite proxy
      // Assuming Vite proxy is set up for /api -> http://localhost:3000 in dev
      // or using direct full URL if needed. For now /api/contact.
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      toast.success('Mesajınız başarıyla gönderildi!');
      setFormData({
        name: '',
        email: '',
        subject: 'Genel',
        message: ''
      });
    } catch (error: unknown) {
      console.error('Contact error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-900/50 relative overflow-hidden" id="contact">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Bize Ulaşın
            </h2>
            <p className="text-gray-400">
              Simülasyonlar, üyelik veya diğer konularda sorularınız mı var? Bize yazın.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User size={16} className="text-blue-400" />
                    İsim Soyisim
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Adınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Mail size={16} className="text-blue-400" />
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-400" />
                  Konu
                </label>
                <select
                  id="subject"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Genel">Genel Soru</option>
                  <option value="Üyelik">Üyelik / Ödeme</option>
                  <option value="Teknik">Teknik Destek</option>
                  <option value="Simülasyon">Simülasyonlar Hakkında</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
