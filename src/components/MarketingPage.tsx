import React from 'react';
import { Check, ArrowRight, Brain, Clock, Target, Award, Play, Zap } from 'lucide-react';

interface MarketingPageProps {
  onStartDemo: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({ onStartDemo }) => {
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
              Train Your Mind. Earn Your Wings.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              The Ultimate Psychometric Prep Platform for Pilot Cadets
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Practice real-world aptitude tests used in airline cadet selection processes.
              Improve speed, accuracy, and decision-making — before the real assessment.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <button 
                onClick={onStartDemo}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Try Free Demo
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={onStartDemo}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all border border-white/10 backdrop-blur-sm"
              >
                Start Your Preparation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {[
                "Realistic PACE / DLR / Skytest-style simulations",
                "Timed exercises & performance tracking",
                "Cognitive, multitasking & spatial skills training",
                "Designed for First Officer & Cadet candidates"
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
            <h2 className="text-3xl font-bold mb-8">What We Do</h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              CadetPrep Academy is an independent online preparation platform designed to help pilot cadet candidates improve their psychometric and cognitive skills.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Our simulations are inspired by commonly used airline assessment methodologies but are not affiliated with or endorsed by any airline or testing authority.
            </p>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Training Modules</h2>
            <p className="text-gray-400">Train the cognitive skills airlines expect from future pilots.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <Brain />, title: "Cognitive Core", desc: "Enhance mental processing speed and accuracy" },
              { icon: <Target />, title: "Spatial Awareness", desc: "Master orientation and 3D visualization tasks" },
              { icon: <Clock />, title: "Mental Arithmetic", desc: "Quick calculation under time pressure" },
              { icon: <Award />, title: "Memory & Attention", desc: "Boost short-term memory capacity" },
              { icon: <Play />, title: "Multitasking", desc: "Handle multiple information streams simultaneously" },
              { icon: <Zap />, title: "Reaction Speed", desc: "Test and improve your response times" },
              { icon: <Target />, title: "Pilot Aptitude", desc: "Comprehensive aptitude simulation" },
              { icon: <Brain />, title: "Decision Making", desc: "Critical thinking under pressure" }
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Membership Plans</h2>
            <p className="text-gray-400">Choose the right plan for your preparation journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <div className="mb-6">
                <div className="text-green-400 font-bold mb-2">Starter</div>
                <div className="text-3xl font-bold">Free</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400" /> Limited practice modules
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400" /> Sample simulations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400" /> Performance overview
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-red-500 text-xs">⛔</span> No advanced analytics
                </li>
              </ul>
              <button 
                onClick={onStartDemo}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
              >
                Try Now
              </button>
            </div>

            {/* Cadet Prep */}
            <div className="p-8 rounded-2xl bg-white/5 border border-blue-500/30 flex flex-col relative overflow-hidden">
              <div className="mb-6">
                <div className="text-blue-400 font-bold mb-2">Cadet Prep</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€29</span>
                  <span className="text-sm text-gray-400">/ month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> Full psychometric simulations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> Timed test environment
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> Cognitive & multitasking modules
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-blue-400" /> Personal performance tracking
                </li>
              </ul>
              <button 
                onClick={onStartDemo}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Cadet Pro */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-900/40 to-white/5 border border-purple-500/50 flex flex-col relative transform lg:-translate-y-4 shadow-xl">
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <div className="mb-6">
                <div className="text-purple-400 font-bold mb-2">Cadet Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€59</span>
                  <span className="text-sm text-gray-400">/ month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-purple-400" /> Everything in Cadet Prep
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-purple-400" /> Advanced analytics & weak-area detection
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-purple-400" /> Unlimited simulations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-purple-400" /> Real assessment-like difficulty
                </li>
              </ul>
              <button 
                onClick={onStartDemo}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/25"
              >
                Go Pro
              </button>
            </div>

            {/* Cadet Elite */}
            <div className="p-8 rounded-2xl bg-white/5 border border-red-500/30 flex flex-col">
              <div className="mb-6">
                <div className="text-red-400 font-bold mb-2">Cadet Elite</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€149</span>
                  <span className="text-sm text-gray-400">/ one-time</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">30 days intensive access</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-red-400" /> Full Pro access
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-red-400" /> Intensive assessment mode
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-red-400" /> High-pressure simulations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-red-400" /> Ideal for last-month preparation
                </li>
              </ul>
              <button 
                onClick={onStartDemo}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-500/25"
              >
                Get Elite
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
