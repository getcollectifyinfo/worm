import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Box, Activity, Eye, Cpu, Compass, Target } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  image?: string; // Optional image URL for when user provides screenshots
}

const SLIDES: Slide[] = [
  {
    id: 'cube',
    title: 'Cube Rotation Pro',
    subtitle: '3D Uzaysal Algı Simülasyonu',
    icon: <Box size={64} />,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'cap',
    title: 'Flight Capacity (CAP)',
    subtitle: 'Multitasking ve Psikomotor Koordinasyon',
    icon: <Activity size={64} />,
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'capacity',
    title: 'Capacity Test',
    subtitle: 'Bölünmüş Dikkat ve Görsel Takip',
    icon: <Target size={64} />,
    color: 'from-cyan-600 to-blue-700'
  },
  {
    id: 'vigi1',
    title: 'Vigilance 1 (VIGI 1)',
    subtitle: 'Dikkat ve Tepki Süresi Ölçümü',
    icon: <Eye size={64} />,
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'vigi2',
    title: 'Vigilance 2 (VIGI 2)',
    subtitle: 'Dinamik Görsel Tarama',
    icon: <Eye size={64} />,
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 'ipp',
    title: 'IPP Test',
    subtitle: 'Bilgi İşleme ve Çalışma Belleği',
    icon: <Cpu size={64} />,
    color: 'from-purple-600 to-violet-700'
  },
  {
    id: 'worm',
    title: 'Spatial Worm 2D',
    subtitle: 'Yönelim ve Zihinsel Haritalama',
    icon: <Compass size={64} />,
    color: 'from-pink-600 to-fuchsia-700'
  }
];

export const GameScreenshotSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 aspect-video group">
      {/* Slides */}
      <div className="absolute inset-0 transition-all duration-500 ease-in-out">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 flex flex-col items-center justify-center bg-gradient-to-br ${slide.color} ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            {/* Content (Placeholder for Screenshot) */}
            <div className="relative z-20 text-center text-white p-8 transform transition-transform duration-500 scale-100">
              <div className="mb-6 opacity-80 animate-bounce-slow">
                {slide.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{slide.title}</h3>
              <p className="text-blue-100 font-medium bg-white/10 px-4 py-1 rounded-full inline-block backdrop-blur-sm">
                {slide.subtitle}
              </p>
            </div>

            {/* Simulated UI Elements (to look like a game screen) */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-40">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-xs">SIMULATION_MODE_ACTIVE</div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
               <div 
                 className="h-full bg-white transition-all duration-[4000ms] ease-linear"
                 style={{ 
                   width: index === currentSlide && isAutoPlaying ? '100%' : '0%',
                   opacity: index === currentSlide && isAutoPlaying ? 1 : 0
                 }}
               ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
