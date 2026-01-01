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
import { SmartLoginGate } from './Auth/SmartLoginGate';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface SkytestPageProps {
  onBack: () => void;
  onStartFree: () => void;
  onNavigate: (page: Page) => void;
}

const MODULES = [
  {
    id: 'cube',
    nameKey: 'module_name_cube',
    shortDescKey: 'cube_short',
    fullDescKey: 'cube_full',
    measureKeys: [
      'measures_3d',
      'measures_spatial',
      'measures_rotation'
    ]
  },
  {
    id: 'cap',
    nameKey: 'module_name_cap',
    shortDescKey: 'cap_short',
    fullDescKey: 'cap_full',
    measureKeys: [
      'measures_multi',
      'measures_psychomotor',
      'measures_selective',
      'measures_stress'
    ]
  },
  {
    id: 'capacity',
    nameKey: 'module_name_capacity',
    shortDescKey: 'capacity_short',
    fullDescKey: 'capacity_full',
    measureKeys: [
      'measures_divided',
      'measures_sustained',
      'measures_hand_eye'
    ]
  },
  {
    id: 'vigi',
    nameKey: 'module_name_vigi1',
    shortDescKey: 'vigi1_short',
    fullDescKey: 'vigi1_full',
    measureKeys: [
      'measures_vigilance',
      'measures_reaction',
      'measures_audio_visual'
    ]
  },
  {
    id: 'ipp',
    nameKey: 'module_name_ipp',
    shortDescKey: 'ipp_short',
    fullDescKey: 'ipp_full',
    measureKeys: [
      'measures_processing',
      'measures_working_memory',
      'measures_arithmetic',
      'measures_logical'
    ]
  },
  {
    id: 'vigi2',
    nameKey: 'module_name_vigi2',
    shortDescKey: 'vigi2_short',
    fullDescKey: 'vigi2_full',
    measureKeys: [
      'measures_scanning',
      'measures_dynamic',
      'measures_detail'
    ]
  },
  {
    id: 'worm',
    nameKey: 'module_name_worm',
    shortDescKey: 'worm_short',
    fullDescKey: 'worm_full',
    measureKeys: [
      'measures_orientation',
      'measures_mapping',
      'measures_command'
    ]
  }
] as const;

export const SkytestPage: React.FC<SkytestPageProps> = ({ onBack, onStartFree, onNavigate }) => {
  const { t } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[number] | null>(null);
  const [cubePreviewImage, setCubePreviewImage] = useState<string | null>(null);
  const [ippPreviewImage, setIppPreviewImage] = useState<string | null>(null);
  const [wormPreviewImage, setWormPreviewImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLegalAccepted, setIsLegalAccepted] = useState(false);
  const { 
    tier, 
    canAccessModule, 
    showProModal, 
    openProModal, 
    closeProModal,
    handleUpgrade,
    showLoginGate,
    openLoginGate,
    closeLoginGate
  } = useGameAccess();

  const performCheckout = async () => {
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
        alert(t('payment_system_error'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t('payment_connection_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!isLegalAccepted) {
      alert(t('legal_warning_alert'));
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (tier === 'GUEST') {
        localStorage.setItem('pending_checkout_skytest', 'true');
        openLoginGate();
        return;
    }

    performCheckout();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Helmet>
        <title>{t('skytest_title')}</title>
        <meta name="description" content={t('skytest_desc')} />
      </Helmet>
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-center">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ChevronRight className="rotate-180" size={20} />
                {t('home')}
            </button>
            <LanguageToggle />
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
                <span>{t('special_for_pilots')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {t('skytest_hero_title')}
              </h1>
              
              <h2 className="text-xl md:text-2xl text-slate-300 font-light">
                {t('skytest_hero_subtitle')}
              </h2>
              
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                {t('skytest_hero_text')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={onStartFree}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {t('try_free')}
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
                      {t('processing')}
                    </>
                  ) : (
                    t('buy_now')
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
          <h2 className="text-3xl font-bold text-slate-900">{t('what_is_skytest')}</h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              {t('what_is_skytest_p1')}
            </p>
            <p>
              {t('what_is_skytest_p2')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">{t('time_pressure')}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">{t('multitasking')}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">{t('focus')}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-slate-800">{t('cognitive_power')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MODÜLLER (Cards) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{t('training_modules')}</h2>
            <p className="text-slate-600 mt-4">{t('training_modules_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {MODULES.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 flex flex-col h-full group relative">
                {/* Card Thumbnail */}
                <div className="h-40 bg-slate-200 relative overflow-hidden">
                  {module.id === 'cap' && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        {t('soon')}
                      </span>
                    </div>
                  )}
                  {module.id === 'cube' ? (
                    <>
                      <img
                        src="/screenshots/Cube_ss/CUBE_SS00006.png"
                        alt="Cube Rotation Screenshot"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {['CUBE_SS00002.png','CUBE_SS00003.png','CUBE_SS00004.png'].map((name) => (
                          <img
                            key={name}
                            src={`/screenshots/Cube_ss/${name}`}
                            alt="Cube Rotation Thumb"
                            className="w-10 h-10 object-cover rounded-md border border-white/50 shadow-sm"
                            loading="lazy"
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-3 left-4">
                        <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Cube Rotation
                        </span>
                      </div>
                    </>
                  ) : module.id === 'ipp' ? (
                    <>
                      <img
                        src="/screenshots/IPP_ss/IPP_SS00006.png"
                        alt="IPP Test Screenshot"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {['IPP_SS00002.png','IPP_SS00003.png','IPP_SS00004.png'].map((name) => (
                          <img
                            key={name}
                            src={`/screenshots/IPP_ss/${name}`}
                            alt="IPP Test Thumb"
                            className="w-10 h-10 object-cover rounded-md border border-white/50 shadow-sm"
                            loading="lazy"
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-3 left-4">
                        <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wider">
                          IPP Test
                        </span>
                      </div>
                    </>
                  ) : module.id === 'worm' ? (
                    <>
                      <img
                        src="/screenshots/worm_ss/WORM_SS00005.png"
                        alt="Spatial Worm Screenshot"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {['WORM_SS00002.png','WORM_SS00003.png','WORM_SS00004.png'].map((name) => (
                          <img
                            key={name}
                            src={`/screenshots/worm_ss/${name}`}
                            alt="Spatial Worm Thumb"
                            className="w-10 h-10 object-cover rounded-md border border-white/50 shadow-sm"
                            loading="lazy"
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-3 left-4">
                        <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Spatial Worm
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                  {tier === 'GUEST' && !canAccessModule(module.id) && module.id !== 'cap' && module.id !== 'vigi2' && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center text-slate-800 font-bold text-sm">
                      {t('open_with_pro')}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t(module.nameKey)}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow">
                    {t(module.shortDescKey)}
                  </p>
                  <button 
                    onClick={() => {
                      if (tier === 'GUEST' && !canAccessModule(module.id) && module.id !== 'cap' && module.id !== 'vigi2') {
                        openProModal();
                      } else {
                        setSelectedModule(module);
                      }
                    }}
                    className="w-full py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('view_details')}
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
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">{t('who_is_this_for')}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                t('target_audience_1'),
                t('target_audience_2'),
                t('target_audience_3'),
                t('target_audience_4')
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
          <h2 className="text-3xl font-bold mb-12">{t('start_preparing_now')}</h2>
          
          <div className="max-w-md mx-auto bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-4 py-1 rounded-bl-xl text-white">
              {t('popular')}
            </div>

            <h3 className="text-2xl font-bold mb-2">{t('skytest_package')}</h3>
            <div className="flex items-baseline justify-center gap-1 my-6">
              <span className="text-5xl font-extrabold text-white">500</span>
              <span className="text-xl text-slate-400">{t('per_month')}</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-sm text-slate-400">{t('package_feature_1')}</p>
              <p className="text-xs text-slate-500 italic">{t('package_note')}</p>
              
              <div className="flex items-start justify-center gap-2 text-left pt-2">
                <input 
                  type="checkbox" 
                  id="legal-check" 
                  checked={isLegalAccepted}
                  onChange={(e) => setIsLegalAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="legal-check" className="text-xs text-slate-400 select-none cursor-pointer">
                  {t('legal_checkbox_label')}
                  <br />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('LEGAL_DISCLAIMER');
                    }}
                    className="text-blue-400 hover:text-blue-300 underline mt-1"
                  >
                    {t('read_legal_disclaimer')}
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
                    {t('processing')}
                  </>
                ) : (
                  t('buy_now_button')
                )}
              </button>
              <button 
                onClick={onStartFree}
                className="w-full py-3 text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                {t('or_try_free')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMING SOON */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">{t('coming_soon_packages')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: t('package_dlr_name'), desc: t('package_dlr_desc') },
              { name: t('package_mollymawk_name'), desc: t('package_mollymawk_desc') },
              { name: t('package_allinone_name'), desc: t('package_allinone_desc') }
            ].map((pack, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-800">{pack.name}</h3>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    {t('badge_soon_sub')}
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
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t('faq_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => onNavigate('SKYTEST_BLOG_1')}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
            >
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{t('blog_1_title')}</h3>
              <p className="text-sm text-slate-500">{t('blog_1_desc')}</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                {t('read_more')} <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button 
              onClick={() => onNavigate('SKYTEST_PREPARATION_BLOG')}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
            >
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{t('blog_2_title')}</h3>
              <p className="text-sm text-slate-500">{t('blog_2_desc')}</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                {t('read_more')} <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button 
              onClick={() => onNavigate('SKYTEST_PEGASUS_BLOG')}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
            >
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{t('blog_3_title')}</h3>
              <p className="text-sm text-slate-500">{t('blog_3_desc')}</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                {t('read_more')} <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 7. SEO CONTENT & FAQ */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('skytest_seo_title')}</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                    {t('skytest_seo_p1')}
                </p>
                <p>
                    {t('skytest_seo_p2')}
                </p>
                <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-4">{t('skytest_seo_why_title')}</h3>
                <p>
                    {t('skytest_seo_why_text')}
                </p>
                <p>
                    {t('skytest_seo_expert_text')}
                </p>
            </div>
        </div>
      </section>
      
      {/* Disclaimer Footer */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
                {t('footer_disclaimer')}
                <button 
                    onClick={() => onNavigate('LEGAL_DISCLAIMER')}
                    className="text-slate-600 hover:text-slate-800 underline ml-1 font-medium"
                >
                    {t('detailed_legal_disclaimer')}
                </button>
            </p>
        </div>
      </section>

      <footer className="py-12 bg-[#050914] text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            {t('footer_disclaimer')}
          </p>
          <div className="mt-4 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {t('footer_copyright')}
          </div>
        </div>
      </footer>

      {/* MODULE DETAIL MODAL */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{t(selectedModule.nameKey)}</h3>
              <button 
                onClick={() => setSelectedModule(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
              {/* Preview */}
              {selectedModule.id === 'cube' ? (
                <>
                  <div className="w-full aspect-video bg-black rounded-xl mb-6 overflow-hidden">
                    {cubePreviewImage ? (
                      <img
                        src={`/screenshots/Cube_ss/${cubePreviewImage}`}
                        alt="Cube Rotation Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src="/screenshots/Cube_ss/Cube_ScreenRecording.mp4"
                        className="w-full h-full"
                        controls
                        poster="/screenshots/Cube_ss/CUBE_SS00007.png"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {['CUBE_SS00001.png','CUBE_SS00005.png','CUBE_SS00006.png'].map((name) => (
                      <button
                        key={name}
                        onClick={() => setCubePreviewImage(name)}
                        className={`rounded-lg border ${cubePreviewImage === name ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200'}`}
                      >
                        <img
                          src={`/screenshots/Cube_ss/${name}`}
                          alt="Cube Rotation Preview"
                          className="w-full h-24 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : selectedModule.id === 'ipp' ? (
                <>
                  <div className="w-full aspect-video bg-black rounded-xl mb-6 overflow-hidden">
                    {ippPreviewImage ? (
                      <img
                        src={`/screenshots/IPP_ss/${ippPreviewImage}`}
                        alt="IPP Test Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src="/screenshots/IPP_ss/IPP_Screen_Recording.mp4"
                        className="w-full h-full"
                        controls
                        poster="/screenshots/IPP_ss/IPP_SS00007.png"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {['IPP_SS00001.png','IPP_SS00005.png','IPP_SS00006.png'].map((name) => (
                      <button
                        key={name}
                        onClick={() => setIppPreviewImage(name)}
                        className={`rounded-lg border ${ippPreviewImage === name ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200'}`}
                      >
                        <img
                          src={`/screenshots/IPP_ss/${name}`}
                          alt="IPP Test Preview"
                          className="w-full h-24 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : selectedModule.id === 'worm' ? (
                <>
                  <div className="w-full aspect-video bg-black rounded-xl mb-6 overflow-hidden">
                    {wormPreviewImage ? (
                      <img
                        src={`/screenshots/worm_ss/${wormPreviewImage}`}
                        alt="Spatial Worm Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src="/screenshots/worm_ss/WORM_Recording.mp4"
                        className="w-full h-full"
                        controls
                        poster="/screenshots/worm_ss/WORM_SS00007.png"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {['WORM_SS00001.png','WORM_SS00005.png','WORM_SS00006.png'].map((name) => (
                      <button
                        key={name}
                        onClick={() => setWormPreviewImage(name)}
                        className={`rounded-lg border ${wormPreviewImage === name ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200'}`}
                      >
                        <img
                          src={`/screenshots/worm_ss/${name}`}
                          alt="Spatial Worm Preview"
                          className="w-full h-24 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full aspect-video bg-slate-900 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-slate-900/40"></div>
                  <Activity size={48} className="text-white/20" />
                  <span className="text-white/40 font-mono text-sm mt-2 ml-2">HD PREVIEW</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">{t('about_module')}</h4>
                  <p className="text-slate-700 leading-relaxed">
                    {t(selectedModule.fullDescKey)}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">{t('what_measures')}</h4>
                  <ul className="space-y-3">
                    {selectedModule.measureKeys.map((m, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {t(m)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              {selectedModule.id === 'cap' ? (
                 <button 
                   disabled
                   className="px-6 py-2 bg-slate-200 text-slate-500 rounded-lg font-medium cursor-not-allowed"
                 >
                   {t('soon')}
                 </button>
              ) : (
                <button 
                  onClick={() => {
                    if (selectedModule.id === 'cube') {
                      onNavigate('CUBE');
                    } else if (selectedModule.id === 'ipp') {
                      onNavigate('IPP');
                    } else if (selectedModule.id === 'worm') {
                      onNavigate('WORM');
                    } else if (selectedModule.id === 'vigi') {
                      onNavigate('VIGI1');
                    } else if (selectedModule.id === 'vigi2') {
                      onNavigate('VIGI');
                    }
                    setSelectedModule(null);
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {t('try_module')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <ProAccessModal isOpen={showProModal} onClose={closeProModal} onUpgrade={handleUpgrade} />
      <SmartLoginGate 
         isOpen={showLoginGate}
         onClose={closeLoginGate}
       />
     </div>
   );
};
