import React, { useState, useEffect } from 'react';
import { useCubeGameLogic } from './useCubeGameLogic';
import type { CubePosition } from './useCubeGameLogic';
import { ArrowLeft, Play, Settings, HelpCircle, Book, FlaskConical, Box, RotateCw, Lightbulb, ArrowRight } from 'lucide-react';
import { GameTutorial } from '../GameTutorial';
import { CubeDemoAnimation } from './CubeDemoAnimation';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';
import { SmartLoginGate } from '../Auth/SmartLoginGate';

import { PracticeMode } from './PracticeMode';

import { toast, Toaster } from 'react-hot-toast';

interface CubeGameProps {
  onExit: () => void;
}

export const CubeGame: React.FC<CubeGameProps> = ({ onExit }) => {
  const {
    tier,
    checkAccess,
    showProModal,
    closeProModal,
    openProModal,
    maxDuration,
    handleUpgrade,
    showLoginGate,
    closeLoginGate,
    openLoginGate
  } = useGameAccess();

  const {
    phase,
    targetLabel,
    currentCommand,
    userAnswer,
    correctAnswer,
    score,
    round,
    setCommandSpeed,
    setCommandCount,
    startGame,
    handleAnswer,
    nextRound
  } = useCubeGameLogic();

  const [hasStarted, setHasStarted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [proModalVariant, setProModalVariant] = useState<'default' | 'exam-settings'>('default');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        setTimeout(() => {
            setIsSettingsOpen(true);
            setShowSuccessModal(true);
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }, 0);
    }
  }, []);

  const handleOpenTutorial = () => {
    setTutorialStep(0);
    setIsTutorialOpen(true);
  };

  const handleStartGame = () => {
    if (!checkAccess('cube')) return;
    if (tier === 'GUEST') {
      setCommandCount(3);
    }
    setHasStarted(true);
    startGame();
  };

  const handleMiniExam = () => {
    // Mini exam settings: Easy (3 commands), slower speed?
    // Assuming 3 commands is easy.
    setCommandCount(3);
    setCommandSpeed(1500); // Slower/easier speed
    setHasStarted(true);
    startGame();
  };

  const handleOpenSettings = () => {
    if (tier === 'GUEST') {
        openLoginGate();
        return;
    }
    // Debug toast
    // toast.success('Practice Mode Loading...');
    
    setIsSettingsOpen(true);
  };

  const handleCloseProModal = () => {
    closeProModal();
    setProModalVariant('default');
  };

  const handleLoginClose = () => {
    closeLoginGate();
    toast('Practice için giriş yapmalısın.', {
        icon: '🔒',
        style: {
            background: '#333',
            color: '#fff',
        },
    });
  };

  const handleLoginSuccess = () => {
    closeLoginGate();
    setIsSettingsOpen(true); // Directly open settings (practice mode) after login
  };

  useEffect(() => {
    if (hasStarted && maxDuration > 0) {
      const timer = setTimeout(() => {
        setHasStarted(false);
        setProModalVariant('default');
        openProModal();
      }, maxDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, maxDuration, openProModal]);

  const renderCommand = () => {
    if (!currentCommand) return null;
    
    return (
      <div className="flex flex-col items-center justify-center animate-in zoom-in duration-300">
        <span className="text-7xl font-black text-white tracking-widest">{currentCommand}</span>
      </div>
    );
  };

  const renderOptions = () => {
    const positions: CubePosition[] = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT', 'FRONT', 'BACK'];
    
    return (
      <div className="grid grid-cols-3 gap-4 max-w-2xl w-full">
        {positions.map(pos => {
          let btnClass = "h-24 rounded-xl text-xl font-bold transition-all duration-200 border-4 ";
          
          if (phase === 'FEEDBACK') {
            if (pos === correctAnswer) {
              btnClass += "bg-green-600 border-green-400 text-white";
            } else if (pos === userAnswer) {
              btnClass += "bg-red-600 border-red-400 text-white";
            } else {
              btnClass += "bg-gray-700 border-gray-600 text-gray-400 opacity-50";
            }
          } else {
            btnClass += "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-blue-500 hover:scale-105";
          }

          return (
            <button
              key={pos}
              onClick={() => handleAnswer(pos)}
              disabled={phase !== 'WAITING_ANSWER'}
              className={btnClass}
            >
              {pos}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-[#1a1a1a] flex flex-col items-center p-8 relative">
      <Toaster position="top-center" />
      {showProModal && (
        <ProAccessModal 
          isOpen={showProModal} 
          onClose={handleCloseProModal}
          onUpgrade={handleUpgrade}
          variant={proModalVariant}
          title={proModalVariant === 'exam-settings' ? "Gerçek Sınav Ayarları" : undefined}
          description={proModalVariant === 'exam-settings' ? "Orta ve zor seviye ayarlar, zaman baskısı ve görev yoğunluğu açısından gerçek sınav koşullarına en yakın yapılandırmadır. Bu ayarlar yalnızca Pro üyelikte açılır." : undefined}
          ctaText={proModalVariant === 'exam-settings' ? "Pro’ya Geç – Gerçek Sınav Modu" : undefined}
          trustText={proModalVariant === 'exam-settings' ? "İstediğin zaman iptal edebilirsin." : undefined}
        />
      )}
      
      <SmartLoginGate
        isOpen={showLoginGate}
        onClose={handleLoginClose}
        onLoginSuccess={handleLoginSuccess}
      />

      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title={tutorialStep === 0 ? "Cube Rotation Testi Nasıl İşler?" : tutorialStep === 5 ? "Taktik ve Özet" : "Learn Mode"}
        hideTitleSuffix={true}
        ctaText={tutorialStep === 0 ? "▶️ Mantığını Öğren" : tutorialStep === 5 ? "Practice Mode'a Geç" : "Sonraki"}
        onCtaClick={() => {
            if (tutorialStep === 0) {
                setTutorialStep(1);
            } else if (tutorialStep === 1) {
                setTutorialStep(2); 
            } else if (tutorialStep === 2) {
                setTutorialStep(3);
            } else if (tutorialStep === 3) {
                setTutorialStep(4);
            } else if (tutorialStep === 4) {
                setTutorialStep(5);
            } else if (tutorialStep === 5) {
                // End of tutorial -> Go to Practice Mode
                setIsTutorialOpen(false);
                handleOpenSettings(); // Open Practice Mode settings
            } else {
                setIsTutorialOpen(false);
            }
        }}
        secondaryCtaText={tutorialStep > 0 ? "Önceki" : undefined}
        onSecondaryCtaClick={() => {
            if (tutorialStep > 0) setTutorialStep(prev => prev - 1);
        }}
      >
        {tutorialStep === 0 ? (
        <div className="space-y-8">
            {/* Animation Demo */}
            <CubeDemoAnimation mode="demo" />

            {/* Steps */}
            <div className="space-y-6">
                {/* 1. Başlangıç */}
                <div className="flex gap-4 items-start bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                        <Box size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">1. Başlangıç</h3>
                        <p className="text-gray-300">Size küpün altı yüzünden biri verilir.</p>
                    </div>
                </div>

                {/* 2. Talimatlar */}
                <div className="flex gap-4 items-start bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400">
                        <RotateCw size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">2. Talimatlar</h3>
                        <p className="text-gray-300">Ekrana sırayla yön talimatları gelir.<br/>(LEFT, RIGHT, FRONT, BACK)</p>
                    </div>
                </div>

                {/* 3. Soru */}
                <div className="flex gap-4 items-start bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="bg-green-500/20 p-3 rounded-lg text-green-400">
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">3. Soru</h3>
                        <p className="text-gray-300">Tüm talimatlar bittikten sonra, başlangıçta verilen yüzün şimdi nerede olduğu sorulur.</p>
                    </div>
                </div>
            </div>

            {/* Sakinleştirici Cümle */}
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                <p className="text-blue-200 text-center font-medium">
                    Bu testte küp çevrilmez. <br/>
                    Küp, masadaki bir kutu gibi sağa, sola, öne veya arkaya yatırılır.
                </p>
            </div>
        </div>
        ) : tutorialStep === 1 ? (
            <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">LEFT Komutu</h2>
                    <p className="text-xl text-blue-400 font-medium">LEFT komutunda küp sola yatırılır.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Animation & Descriptions */}
                    <div className="space-y-6">
                         {/* Animation - Left Only */}
                        <div className="flex justify-center">
                             <CubeDemoAnimation mode="left" />
                        </div>

                        {/* Description */}
                        <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700/50 text-center space-y-4">
                            <p className="text-white text-lg">
                                Ön yüz (FRONT) ve arka yüz (BACK) değişmez.
                            </p>
                            <p className="text-gray-400 text-sm">
                                Sağ yüz (RIGHT) üste gelir, sol yüz (LEFT) alta iner.
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>• LEFT komutunda sadece yandaki çizimdeki yeşil alanlar değişir.</p>
                            <p>• Diğerlerine bakmanıza gerek yok.</p>
                            <p>• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz.</p>
                        </div>

                        {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                                <span className="font-bold text-blue-100">Tip:</span> LEFT komutunda dış halka saat yönünün tersine sola doğru yer değiştirir.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Diagram */}
                    <div className="flex flex-col items-center justify-center h-full">
                        <img 
                            src="/LEFT.png" 
                            alt="Left Rotation Diagram" 
                            className="w-full max-w-md h-auto rounded-lg shadow-xl border border-gray-700/50" 
                        />
                         <p className="text-xs text-gray-500 mt-2">Görsel: Dönüş Yönü Diyagramı</p>
                    </div>
                </div>
            </div>
        ) : tutorialStep === 2 ? (
            <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">RIGHT Komutu</h2>
                    <p className="text-xl text-blue-400 font-medium">RIGHT komutunda küp sağa yatırılır.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Animation & Descriptions */}
                    <div className="space-y-6">
                         {/* Animation - Right Only */}
                        <div className="flex justify-center">
                             <CubeDemoAnimation mode="right" />
                        </div>

                        {/* Description */}
                        <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700/50 text-center space-y-4">
                            <p className="text-white text-lg">
                                Ön yüz (FRONT) ve arka yüz (BACK) değişmez.
                            </p>
                            <p className="text-gray-400 text-sm">
                                Sol yüz (LEFT) üste gelir, sağ yüz (RIGHT) alta iner.
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>• RIGHT komutunda sadece yandaki çizimdeki yeşil alanlar değişir. (LEFT ile aynı alanlar)</p>
                            <p>• Diğerlerine bakmanıza gerek yok.</p>
                            <p>• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz.</p>
                        </div>

                        {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                                <span className="font-bold text-blue-100">Tip:</span> RIGHT komutunda dış halka saat yönünde sağa doğru yer değiştirir.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Diagram */}
                    <div className="flex flex-col items-center justify-center h-full">
                        <img 
                            src="/RIGHT.png" 
                            alt="Right Rotation Diagram" 
                            className="w-full max-w-md h-auto rounded-lg shadow-xl border border-gray-700/50" 
                        />
                         <p className="text-xs text-gray-500 mt-2">Görsel: Dönüş Yönü Diyagramı</p>
                    </div>
                </div>
            </div>
        ) : tutorialStep === 3 ? (
            <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">FRONT Komutu</h2>
                    <p className="text-xl text-blue-400 font-medium">FRONT komutunda küp öne yatırılır.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Animation & Descriptions */}
                    <div className="space-y-6">
                         {/* Animation - Front Only */}
                        <div className="flex justify-center">
                             <CubeDemoAnimation mode="front" />
                        </div>

                        {/* Description */}
                        <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700/50 text-center space-y-4">
                            <p className="text-white text-lg">
                                Sağ yüz (RIGHT) ve sol yüz (LEFT) değişmez.
                            </p>
                            <p className="text-gray-400 text-sm">
                                Arka yüz (BACK) üste gelir, ön yüz (FRONT) alta iner.
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>• FRONT komutunda sadece yandaki çizimdeki yeşil alanlar değişir.</p>
                            <p>• Diğerlerine bakmanıza gerek yok.</p>
                            <p>• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz.</p>
                        </div>

                        {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                                <span className="font-bold text-blue-100">Tip:</span> FRONT komutunda iç halka aşağıya doğru yer değiştirir. BACK ten sonra tekrar TOP olur.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Diagram */}
                    <div className="flex flex-col items-center justify-center h-full">
                        <img 
                            src="/FRONT.png" 
                            alt="Front Rotation Diagram" 
                            className="w-full max-w-md h-auto rounded-lg shadow-xl border border-gray-700/50" 
                        />
                         <p className="text-xs text-gray-500 mt-2">Görsel: Dönüş Yönü Diyagramı</p>
                    </div>
                </div>
            </div>
        ) : tutorialStep === 4 ? (
            <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">BACK Komutu</h2>
                    <p className="text-xl text-blue-400 font-medium">BACK komutunda küp arkaya yatırılır.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Animation & Descriptions */}
                    <div className="space-y-6">
                         {/* Animation - Back Only */}
                        <div className="flex justify-center">
                             <CubeDemoAnimation mode="back" />
                        </div>

                        {/* Description */}
                        <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700/50 text-center space-y-4">
                            <p className="text-white text-lg">
                                Sağ yüz (RIGHT) ve sol yüz (LEFT) değişmez.
                            </p>
                            <p className="text-gray-400 text-sm">
                                Ön yüz (FRONT) üste gelir, arka yüz (BACK) alta iner.
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>• BACK komutunda sadece yandaki çizimdeki yeşil alanlar değişir.</p>
                            <p>• Diğerlerine bakmanıza gerek yok.</p>
                            <p>• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz.</p>
                        </div>

                        {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                                <span className="font-bold text-blue-100">Tip:</span> BACK komutunda iç halka yukarıya doğru yer değiştirir. TOP tan sonra tekrar BACK olur.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Diagram */}
                    <div className="flex flex-col items-center justify-center h-full">
                        <img 
                            src="/BACK.png" 
                            alt="Back Rotation Diagram" 
                            className="w-full max-w-md h-auto rounded-lg shadow-xl border border-gray-700/50" 
                        />
                         <p className="text-xs text-gray-500 mt-2">Görsel: Dönüş Yönü Diyagramı</p>
                    </div>
                </div>
            </div>
        ) : tutorialStep === 5 ? (
            <div className="space-y-8 flex flex-col items-center justify-center min-h-[400px]">
                {/* Icon */}
                <div className="bg-yellow-500/20 p-6 rounded-full mb-4 animate-pulse">
                    <Lightbulb size={48} className="text-yellow-400" />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Önemli Taktik</h2>
                </div>

                {/* Content */}
                <div className="bg-gray-700/30 p-8 rounded-xl border border-gray-700/50 max-w-2xl text-center space-y-6 shadow-xl">
                    <p className="text-xl text-gray-200 leading-relaxed font-medium">
                        "Küp çevirme testinde üç boyutlu bir kübü defalarca zihninizde çevirmek yerine, 
                        bunu bir <span className="text-blue-400 font-bold">etiket yer değiştirme oyunu</span> şeklinde düşünmek, 
                        iki boyutlu çizim ile size verilen yüzün her adımdaki gideceği yeri takip ederek sonuca ulaşmak 
                        sıkça başvurulan ve başarıyı arttıran bir taktiktir."
                    </p>
                </div>

                {/* Visual Aid */}
                <div className="flex gap-4 opacity-50">
                    <Box size={32} className="text-gray-500" />
                    <ArrowRight size={32} className="text-gray-600" />
                    <RotateCw size={32} className="text-gray-500" />
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                <p className="text-xl">Step {tutorialStep + 1} content coming soon...</p>
            </div>
        )}
      </GameTutorial>

      {isSettingsOpen && (
        <PracticeMode 
          onExit={() => setIsSettingsOpen(false)} 
          tier={tier}
          onShowProModal={() => {
            setIsSettingsOpen(false);
            openProModal();
          }}
          showSuccessModal={showSuccessModal}
          onCloseSuccessModal={() => setShowSuccessModal(false)}
        />
      )}

      {!hasStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full flex flex-col gap-4 animate-fade-in">
                
                <div className="flex justify-center -mb-2">
                    <img src="/logo.png" alt="Logo" className="h-32 drop-shadow-lg" />
                </div>

                <div className="flex items-center justify-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-center text-white tracking-wider">CUBE ROTATION</h1>
                </div>

                {/* EXAM MODE */}
                <button 
                    onClick={handleStartGame}
                    className="group flex flex-col items-center justify-center w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all hover:scale-105 shadow-lg relative overflow-hidden"
                >
                    <div className="flex items-center gap-3">
                        <Play size={28} className="fill-current" />
                        <span className="text-2xl font-bold">EXAM MODE</span>
                    </div>
                    <span className="text-green-100 text-sm font-medium mt-1">Gerçek sınav temposu ve skor</span>
                </button>

                {/* PRACTICE MODE */}
                <button 
                    onClick={handleOpenSettings}
                    className="group flex flex-col items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                >
                    <div className="flex items-center gap-3">
                        <Settings size={24} />
                        <span className="text-xl font-bold">PRACTICE MODE</span>
                    </div>
                    <span className="text-blue-100 text-xs font-medium mt-1">Alıştırmalarla refleks kazan</span>
                </button>

                {/* LEARN MODE */}
                <button 
                    onClick={handleOpenTutorial}
                    className="group flex flex-col items-center justify-center w-full py-3 bg-[#6d28d9] hover:bg-[#5b21b6] text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                >
                    <div className="flex items-center gap-3">
                        <Book size={24} />
                        <span className="text-xl font-bold">LEARN MODE</span>
                    </div>
                    <span className="text-purple-100 text-xs font-medium mt-1">Küp mantığını kısa ve net öğren</span>
                </button>

                {/* MINI EXAM */}
                <button 
                    onClick={handleMiniExam}
                    className="group flex flex-col items-center justify-center w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white rounded-lg transition-all hover:scale-105 border border-gray-600 relative"
                >
                    <div className="flex items-center gap-2">
                        <FlaskConical size={18} />
                        <span className="text-lg font-bold">MINI EXAM (Easy)</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded border border-green-500/30">FREE</span>
                    </div>
                    <span className="text-gray-400 text-xs mt-0.5">2 dakikalık örnek sınav</span>
                </button>

                <div className="h-px bg-gray-700 my-2" />

                <button 
                    onClick={onExit}
                    className="group flex items-center justify-center gap-3 w-full py-3 text-gray-400 hover:text-white transition-all"
                >
                    <ArrowLeft size={20} />
                    BACK TO MENU
                </button>
            </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-12">
            <button 
              onClick={onExit}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Exit</span>
            </button>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-400">ROUND</div>
                <div className="text-2xl font-bold text-white">{round}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">SCORE</div>
                <div className="text-2xl font-bold text-green-400">{score}</div>
              </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={handleOpenTutorial}
                    className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="How to Play"
                >
                    <HelpCircle size={24} />
                </button>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="Settings"
                >
                    <Settings size={24} />
                </button>
            </div>
          </div>

          {/* Game Content */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">
            
            {phase === 'SHOWING_TARGET' && (
              <div className="text-center animate-in fade-in duration-500">
                <h2 className="text-3xl text-gray-300 mb-6">Follow the face:</h2>
                <div className="text-8xl font-black text-blue-500 tracking-wider">
                  {targetLabel}
                </div>
              </div>
            )}

            {phase === 'SHOWING_COMMANDS' && (
              <div className="flex items-center justify-center h-64 w-full">
                {renderCommand()}
              </div>
            )}

            {(phase === 'WAITING_ANSWER' || phase === 'FEEDBACK') && (
              <div className="flex flex-col items-center gap-8 w-full animate-in slide-in-from-bottom-10 duration-500">
                {renderOptions()}
                
                {phase === 'FEEDBACK' && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    <div className={`text-2xl font-bold ${userAnswer === correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                      {userAnswer === correctAnswer ? 'CORRECT!' : 'WRONG!'}
                    </div>
                    <button
                      onClick={nextRound}
                      className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all transform hover:scale-105 font-bold text-xl shadow-lg shadow-blue-900/50"
                    >
                      <Play size={24} />
                      Next Round
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
          
          {/* Instructions Footer */}
        </>
      )}
    </div>
  );
};
