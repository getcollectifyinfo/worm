import React, { useState, useEffect } from 'react';
import { useCubeGameLogic } from './useCubeGameLogic';
import type { CubePosition } from './useCubeGameLogic';
import { ArrowLeft, Play, Settings, HelpCircle, Box, RotateCw, Lightbulb, ArrowRight, Clock } from 'lucide-react';
import { GameTutorial } from '../GameTutorial';
import { CubeDemoAnimation } from './CubeDemoAnimation';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';
import { SmartLoginGate } from '../Auth/SmartLoginGate';
import { SubscriptionSuccess } from '../SubscriptionSuccess';
import { useAuth } from '../../hooks/useAuth';
import { GameStartMenu } from '../GameStartMenu';
import { GameResultsModal } from '../GameResultsModal';
import { statsService } from '../../services/statsService';

import { PracticeMode } from './PracticeMode';
import { CubeSettingsModal } from './CubeSettingsModal';
import { MiniExamEndModal } from '../MiniExamEndModal';

import { toast, Toaster } from 'react-hot-toast';

interface CubeGameProps {
  onExit: () => void;
}

export const CubeGame: React.FC<CubeGameProps> = ({ onExit }) => {
  const { refreshSession } = useAuth();
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
    avgReactionTime,
    correctCount,
    wrongCount,
    commandSpeed,
    commandCount,
    setCommandSpeed,
    setCommandCount,
    startGame,
    handleAnswer,
    nextRound
  } = useCubeGameLogic();

  const [hasStarted, setHasStarted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const startTimeRef = React.useRef(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [locale, setLocale] = useState<'tr' | 'en'>('tr');
  const [proModalVariant, setProModalVariant] = useState<'default' | 'exam-settings' | 'mini-exam-end'>('default');
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [subscriptionSource, setSubscriptionSource] = useState<string | null>(null);
  const [isMiniExam, setIsMiniExam] = useState(false);
  const [miniExamTimeLeft, setMiniExamTimeLeft] = useState(120);
  const [showMiniExamModal, setShowMiniExamModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        // Refresh session to update user tier
        if (refreshSession) {
            refreshSession();
        }
        
        const source = params.get('source');
        
        setTimeout(() => {
            setSubscriptionSource(source);
            setShowSubscriptionSuccess(true);
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }, 500);
    }
  }, [refreshSession]);

  const handleOpenTutorial = () => {
    setTutorialStep(0);
    setIsTutorialOpen(true);
  };

  const handleStartGame = () => {
    if (!checkAccess('cube')) return;
    
    startTimeRef.current = Date.now();
    
    // GUEST & FREE -> MINI EXAM MODE (2 mins, Slow, Easy)
    if (tier !== 'PRO') {
        setCommandCount(3);
        setCommandSpeed(2000); // En yavaş
        setHasStarted(true);
        setIsMiniExam(true);
        setMiniExamTimeLeft(120); // 2 minutes
        startGame();
        return;
    }

    // PRO -> REAL EXAM MODE
    setHasStarted(true);
    setIsMiniExam(false);
    setCommandCount(4);
    setCommandSpeed(1500);
    startGame();
  };

  const [gameDuration, setGameDuration] = useState(0);

  const handleEndGame = React.useCallback(async () => {
      setHasStarted(false);
      const duration = (Date.now() - startTimeRef.current) / 1000;
      setGameDuration(Math.round(duration));
      
      // Save stats
      if (tier !== 'GUEST') {
          await statsService.saveSession({
              game_type: 'CUBE',
              score: score,
              duration_seconds: Math.round(duration),
              metadata: {
                  round: round,
                  correct_count: correctCount,
                  wrong_count: wrongCount,
                  avg_reaction_time_ms: avgReactionTime,
                  accuracy: (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0,
                  settings: { speed: commandSpeed, count: commandCount }
              }
          });
      }

      setShowResults(true);
  }, [tier, score, round, correctCount, wrongCount, avgReactionTime, commandSpeed, commandCount]);

  const handleOpenSettings = () => {
    // Debug toast
    // toast.success('Practice Mode Loading...');
    
    setIsSettingsOpen(true);
  };

  const handleCloseProModal = () => {
    closeProModal();
    setProModalVariant('default');
    setIsMiniExam(false);
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
    
    // Check for pending upgrades
    const pendingUpgrade = localStorage.getItem('pending_pro_upgrade');
    if (pendingUpgrade) {
        localStorage.removeItem('pending_pro_upgrade');
        handleUpgrade('mini-exam-end');
        return;
    }

    setIsSettingsOpen(true); // Directly open settings (practice mode) after login
  };

  // Mini Exam Timer
  useEffect(() => {
    if (hasStarted && isMiniExam) {
        const timer = setInterval(() => {
            setMiniExamTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setHasStarted(false);
                    setShowMiniExamModal(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [hasStarted, isMiniExam]);

  useEffect(() => {
    if (hasStarted && maxDuration > 0 && !isMiniExam) {
      const timer = setTimeout(() => {
        handleEndGame();
      }, maxDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, maxDuration, isMiniExam, handleEndGame]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      {showSubscriptionSuccess && (
          <SubscriptionSuccess 
              onContinue={() => {
                  setShowSubscriptionSuccess(false);
                  setIsSettingsOpen(true);
              }}
              onHome={() => {
                  if (subscriptionSource === 'mini-exam-end') {
                      setShowSubscriptionSuccess(false);
                  } else {
                      setShowSubscriptionSuccess(false);
                      onExit();
                  }
              }}
              source={subscriptionSource}
          />
      )}
      {showProModal && (
        <ProAccessModal 
          isOpen={showProModal} 
          onClose={handleCloseProModal}
          onUpgrade={() => handleUpgrade(isMiniExam ? 'mini-exam-end' : 'menu')}
          variant={proModalVariant}
          title={proModalVariant === 'exam-settings' ? "Gerçek Sınav Ayarları" : undefined}
          description={proModalVariant === 'exam-settings' ? "Orta ve zor seviye ayarlar, zaman baskısı ve görev yoğunluğu açısından gerçek sınav koşullarına en yakın yapılandırmadır. Bu ayarlar yalnızca Pro üyelikte açılır." : undefined}
          ctaText={proModalVariant === 'exam-settings' ? "Pro’ya Geç – Gerçek Sınav Modu" : undefined}
          trustText={proModalVariant === 'exam-settings' ? "İstediğin zaman iptal edebilirsin." : undefined}
        />
      )}
      
      <CubeSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        tier={tier}
        commandSpeed={1500} // Default for now, could be dynamic if we expose state
        commandCount={3} // Default
        onSave={(speed, count) => {
            setCommandSpeed(speed);
            setCommandCount(count);
            setShowSettingsModal(false);
        }}
        onOpenProModal={() => {
            setShowSettingsModal(false);
            setProModalVariant('exam-settings');
            openProModal();
        }}
      />

      <SmartLoginGate
        isOpen={showLoginGate}
        onClose={handleLoginClose}
        onLoginSuccess={handleLoginSuccess}
      />

      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title={
          tutorialStep === 0
            ? (locale === 'tr' ? "Cube Rotation Testi Nasıl İşler?" : "How Does Cube Rotation Work?")
            : tutorialStep === 5
            ? (locale === 'tr' ? "Taktik ve Özet" : "Tips and Summary")
            : "Learn Mode"
          }
        hideTitleSuffix={true}
        ctaText={
          tutorialStep === 0
            ? (locale === 'tr' ? "▶️ Mantığını Öğren" : "▶️ Learn the Logic")
            : tutorialStep === 5
            ? (locale === 'tr' ? "Practice Mode'a Geç" : "Go to Practice Mode")
            : (locale === 'tr' ? "Sonraki" : "Next")
          }
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
        secondaryCtaText={tutorialStep > 0 ? (locale === 'tr' ? "Önceki" : "Previous") : undefined}
        onSecondaryCtaClick={() => {
            if (tutorialStep > 0) setTutorialStep(prev => prev - 1);
        }}
        initialLocale="tr"
        locale={locale}
        onLocaleChange={setLocale}
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
                        <h3 className="text-white font-bold text-lg mb-1">{locale === 'tr' ? "1. Başlangıç" : "1. Start"}</h3>
                        <p className="text-gray-300">
                          {locale === 'tr'
                            ? "Size küpün altı yüzünden biri verilir."
                            : "You are given one of the cube's six faces."}
                        </p>
                    </div>
                </div>

                {/* 2. Talimatlar */}
                <div className="flex gap-4 items-start bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400">
                        <RotateCw size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">{locale === 'tr' ? "2. Talimatlar" : "2. Commands"}</h3>
                        <p className="text-gray-300">
                          {locale === 'tr'
                            ? "Ekrana sırayla yön talimatları gelir."
                            : "Directional commands appear sequentially on screen."}
                          <br/>(LEFT, RIGHT, FRONT, BACK)
                        </p>
                    </div>
                </div>

                {/* 3. Soru */}
                <div className="flex gap-4 items-start bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="bg-green-500/20 p-3 rounded-lg text-green-400">
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">{locale === 'tr' ? "3. Soru" : "3. Question"}</h3>
                        <p className="text-gray-300">
                          {locale === 'tr'
                            ? "Tüm talimatlar bittikten sonra, başlangıçta verilen yüzün şimdi nerede olduğu sorulur."
                            : "After all commands, you're asked where the initially given face is now."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sakinleştirici Cümle */}
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                <p className="text-blue-200 text-center font-medium">
                    {locale === 'tr'
                      ? "Bu testte küp çevrilmez."
                      : "The cube is not rotated."}
                    <br/>
                    {locale === 'tr'
                      ? "Küp, masadaki bir kutu gibi sağa, sola, öne veya arkaya yatırılır."
                      : "It is tilted like a box on a table to the left, right, front, or back."}
                </p>
            </div>
        </div>
        ) : tutorialStep === 1 ? (
            <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">{locale === 'tr' ? "LEFT Komutu" : "LEFT Command"}</h2>
                    <p className="text-xl text-blue-400 font-medium">
                      {locale === 'tr' ? "LEFT komutunda küp sola yatırılır." : "In LEFT, the cube is tilted to the left."}
                    </p>
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
                              {locale === 'tr'
                                ? "Ön yüz (FRONT) ve arka yüz (BACK) değişmez."
                                : "Front (FRONT) and back (BACK) do not change."}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {locale === 'tr'
                                ? "Sağ yüz (RIGHT) üste gelir, sol yüz (LEFT) alta iner."
                                : "Right (RIGHT) moves to top, left (LEFT) moves to bottom."}
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>{locale === 'tr' ? "• LEFT komutunda sadece yandaki çizimdeki yeşil alanlar değişir." : "• Only the green areas in the diagram change in LEFT."}</p>
                            <p>{locale === 'tr' ? "• Diğerlerine bakmanıza gerek yok." : "• No need to consider the others."}</p>
                            <p>{locale === 'tr' ? "• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz." : "• Follow the arrows to track each face."}</p>
                         </div>

                         {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                              <span className="font-bold text-blue-100">{locale === 'tr' ? "Tip:" : "Tip:"}</span> {locale === 'tr' ? "LEFT komutunda dış halka saat yönünün tersine sola doğru yer değiştirir." : "In LEFT, the outer ring shifts counterclockwise to the left."}
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
                    <h2 className="text-3xl font-bold text-white mb-2">{locale === 'tr' ? "RIGHT Komutu" : "RIGHT Command"}</h2>
                    <p className="text-xl text-blue-400 font-medium">
                      {locale === 'tr' ? "RIGHT komutunda küp sağa yatırılır." : "In RIGHT, the cube is tilted to the right."}
                    </p>
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
                              {locale === 'tr'
                                ? "Ön yüz (FRONT) ve arka yüz (BACK) değişmez."
                                : "Front (FRONT) and back (BACK) do not change."}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {locale === 'tr'
                                ? "Sol yüz (LEFT) üste gelir, sağ yüz (RIGHT) alta iner."
                                : "Left (LEFT) moves to top, right (RIGHT) moves to bottom."}
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>{locale === 'tr' ? "• RIGHT komutunda sadece yandaki çizimdeki yeşil alanlar değişir. (LEFT ile aynı alanlar)" : "• Only the green areas in the diagram change in RIGHT (same areas as LEFT)."}
                            </p>
                            <p>{locale === 'tr' ? "• Diğerlerine bakmanıza gerek yok." : "• No need to consider the others."}</p>
                            <p>{locale === 'tr' ? "• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz." : "• Follow the arrows to track each face."}</p>
                         </div>

                         {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                              <span className="font-bold text-blue-100">{locale === 'tr' ? "Tip:" : "Tip:"}</span> {locale === 'tr' ? "RIGHT komutunda dış halka saat yönünde sağa doğru yer değiştirir." : "In RIGHT, the outer ring shifts clockwise to the right."}
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
                    <h2 className="text-3xl font-bold text-white mb-2">{locale === 'tr' ? "FRONT Komutu" : "FRONT Command"}</h2>
                    <p className="text-xl text-blue-400 font-medium">
                      {locale === 'tr' ? "FRONT komutunda küp öne yatırılır." : "In FRONT, the cube is tilted forward."}
                    </p>
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
                              {locale === 'tr'
                                ? "Sağ yüz (RIGHT) ve sol yüz (LEFT) değişmez."
                                : "Right (RIGHT) and left (LEFT) stay the same."}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {locale === 'tr'
                                ? "Arka yüz (BACK) üste gelir, ön yüz (FRONT) alta iner."
                                : "Back (BACK) moves to top, front (FRONT) moves to bottom."}
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>{locale === 'tr' ? "• FRONT komutunda sadece yandaki çizimdeki yeşil alanlar değişir." : "• Only the green areas in the diagram change in FRONT."}</p>
                            <p>{locale === 'tr' ? "• Diğerlerine bakmanıza gerek yok." : "• No need to consider the others."}</p>
                            <p>{locale === 'tr' ? "• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz." : "• Follow the arrows to track each face."}</p>
                         </div>

                         {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                              <span className="font-bold text-blue-100">{locale === 'tr' ? "Tip:" : "Tip:"}</span> {locale === 'tr' ? "FRONT komutunda iç halka aşağıya doğru yer değiştirir. BACK ten sonra tekrar TOP olur." : "In FRONT, the inner ring shifts downward; after BACK it becomes TOP again."}
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
                    <h2 className="text-3xl font-bold text-white mb-2">{locale === 'tr' ? "BACK Komutu" : "BACK Command"}</h2>
                    <p className="text-xl text-blue-400 font-medium">
                      {locale === 'tr' ? "BACK komutunda küp arkaya yatırılır." : "In BACK, the cube is tilted backward."}
                    </p>
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
                              {locale === 'tr'
                                ? "Sağ yüz (RIGHT) ve sol yüz (LEFT) değişmez."
                                : "Right (RIGHT) and left (LEFT) stay the same."}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {locale === 'tr'
                                ? "Ön yüz (FRONT) üste gelir, arka yüz (BACK) alta iner."
                                : "Front (FRONT) moves to top, back (BACK) moves to bottom."}
                            </p>
                        </div>
                        
                         {/* Extra Notes */}
                         <div className="space-y-2 text-gray-300 text-sm">
                            <p>{locale === 'tr' ? "• BACK komutunda sadece yandaki çizimdeki yeşil alanlar değişir." : "• Only the green areas in the diagram change in BACK."}</p>
                            <p>{locale === 'tr' ? "• Diğerlerine bakmanıza gerek yok." : "• No need to consider the others."}</p>
                            <p>{locale === 'tr' ? "• Hangi yüz nereye geliyor ok tuşlarını takip edebilirsiniz." : "• Follow the arrows to track each face."}</p>
                         </div>

                         {/* Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-blue-200 text-sm">
                              <span className="font-bold text-blue-100">{locale === 'tr' ? "Tip:" : "Tip:"}</span> {locale === 'tr' ? "BACK komutunda iç halka yukarıya doğru yer değiştirir. TOP tan sonra tekrar BACK olur." : "In BACK, the inner ring shifts upward; after TOP it becomes BACK again."}
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
                    <h2 className="text-3xl font-bold text-white mb-4">{locale === 'tr' ? "Önemli Taktik" : "Key Tactic"}</h2>
                </div>

                {/* Content */}
                <div className="bg-gray-700/30 p-8 rounded-xl border border-gray-700/50 max-w-2xl text-center space-y-6 shadow-xl">
                    <p className="text-xl text-gray-200 leading-relaxed font-medium">
                      {locale === 'tr' ? (
                        <>
                          "Küp çevirme testinde üç boyutlu bir kübü defalarca zihninizde çevirmek yerine, 
                          bunu bir <span className="text-blue-400 font-bold">etiket yer değiştirme oyunu</span> şeklinde düşünmek, 
                          iki boyutlu çizim ile size verilen yüzün her adımdaki gideceği yeri takip ederek sonuca ulaşmak 
                          sıkça başvurulan ve başarıyı arttıran bir taktiktir."
                        </>
                      ) : (
                        <>
                          "Instead of mentally rotating a 3D cube over and over, 
                          think of it as a <span className="text-blue-400 font-bold">label-tracking game</span>. 
                          Use the 2D diagram to track where the given face goes at each step. 
                          This approach is common and increases success."
                        </>
                      )}
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
        />
      )}

      {!hasStarted && !isSettingsOpen ? (
        <GameStartMenu
            title="CUBE ROTATION"
            onStart={handleStartGame}
            onPractice={handleOpenSettings}
            onLearn={handleOpenTutorial}
            onBack={onExit}
            startLabel="EXAM MODE"
            tier={tier}
        />
      ) : (
        <>
          {/* Mini Exam Timer */}
          {isMiniExam && (
            <div className="absolute top-24 right-8 z-20 flex items-center gap-2 bg-gray-800/80 backdrop-blur px-4 py-2 rounded-xl border border-gray-700 animate-in fade-in slide-in-from-top-4">
                <Clock size={20} className="text-yellow-500" />
                <span className="text-xl font-mono font-bold text-white">
                    {formatTime(miniExamTimeLeft)}
                </span>
            </div>
          )}

          {/* Header */}
          <div className="w-full flex justify-between items-center mb-12">
            <button 
              onClick={handleEndGame}
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
                    onClick={() => setShowSettingsModal(true)}
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

      {/* Moved Mini Exam Modal here for z-index stacking */}
      <MiniExamEndModal
        isOpen={showMiniExamModal}
        onClose={() => setShowMiniExamModal(false)}
        onUpgrade={() => {
            setShowMiniExamModal(false);
            if (tier === 'GUEST') {
                localStorage.setItem('pending_pro_upgrade', 'true');
                openLoginGate();
            } else {
                handleUpgrade('mini-exam-end');
            }
        }}
        onPractice={() => {
             setShowMiniExamModal(false);
             handleOpenSettings();
        }}
      />

      <GameResultsModal
        isOpen={showResults}
        score={score}
        duration={formatTime(gameDuration)}
        tier={tier}
        onRetry={() => {
            setShowResults(false);
            handleStartGame();
        }}
        onExit={onExit}
      >
        <div className="grid grid-cols-2 gap-3 mb-4 w-full">
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Correct</div>
                <div className="text-lg font-bold text-green-400">{correctCount}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Wrong</div>
                <div className="text-lg font-bold text-red-400">{wrongCount}</div>
            </div>
            
            <div className="col-span-2 bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Average Reaction</div>
                <div className="text-xl font-bold text-cyan-400">{avgReactionTime} ms</div>
            </div>

            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</div>
                <div className="text-lg font-bold text-white">
                    {(correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0}%
                </div>
            </div>

            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Total Rounds</div>
                <div className="text-lg font-bold text-white">{round}</div>
            </div>
        </div>
      </GameResultsModal>

    </div>
  );
};
