import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Music, HelpCircle, Settings, LogOut, Play, Pause } from 'lucide-react';
import { AnalogGauge } from './AnalogGauge';
import { DigitalDisplay } from './DigitalDisplay';
import { useVIGI1GameLogic } from './useVIGI1GameLogic';
import { GameStartMenu } from '../GameStartMenu';
import { GameTutorial } from '../GameTutorial';
import { GameSettingsModal, SettingsSection, SettingsLabel, SettingsRange } from '../GameSettingsModal';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';
import { SmartLoginGate } from '../Auth/SmartLoginGate';
import { MiniExamEndModal } from '../MiniExamEndModal';
import { GameResultsModal } from '../GameResultsModal';
import { toast, Toaster } from 'react-hot-toast';

interface VIGI1GameProps {
  onExit: () => void;
}

const VIGI1Game: React.FC<VIGI1GameProps> = ({ onExit }) => {
  const { gameState, actions } = useVIGI1GameLogic();
  const { 
      isPlaying, 
      isPaused,
      score, 
      gameTime, 
      gameDuration, 
      analogValue, 
      digitalValue, 
      totalEvents, 
      caughtEvents, 
      wrongMoves,
      audioEvents,
      caughtAudio,
      wrongAudio,
      audioDifficulty,
      avgReactionTime
  } = gameState;
  const { 
      startGame, 
      stopGame,
      handleEyeClick, 
      handleNoteClick, 
      setGameDuration, 
      setAudioDifficulty,
      pauseGame,
      togglePause
  } = actions;

  const { 
    checkAccess, 
    tier, 
    showProModal, 
    closeProModal, 
    openProModal, 
    handleUpgrade, 
    showLoginGate, 
    closeLoginGate, 
    openLoginGate,
    maxDuration
  } = useGameAccess();
  
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showMiniExamModal, setShowMiniExamModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPractiseSelectOpen, setIsPractiseSelectOpen] = useState(false);
  const [practiseMode, setPractiseMode] = useState<'NONE' | 'AUDIO' | 'VISUAL'>('NONE');
  const [isPractiseRunning, setIsPractiseRunning] = useState(false);
  const [practiseTimeLeft, setPractiseTimeLeft] = useState(120);
  const [practiseDurationMinutes, setPractiseDurationMinutes] = useState(2);
  const [practiseDifficulty, setPractiseDifficulty] = useState(5);
  const [isAudioPrimed, setIsAudioPrimed] = useState(false);
  const [audioCorrect, setAudioCorrect] = useState(0);
  const [audioWrong, setAudioWrong] = useState(0);
  const [lastReactionMs, setLastReactionMs] = useState<number | null>(null);
  const [avgReactionMs, setAvgReactionMs] = useState<number | null>(null);
  const [showPractiseSummary, setShowPractiseSummary] = useState(false);
  const practiseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const practiseToneRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const practiseToneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const practiseToneHistoryRef = useRef<string[]>([]);
  const practiseSeriesToneRef = useRef<string | null>(null);
  const practiseSeriesRemainingRef = useRef<number>(0);
  const practiseRunningRef = useRef<boolean>(false);
  const practiseTargetActiveRef = useRef<boolean>(false);
  const practiseCanClickRef = useRef<boolean>(true);
  const practiseTargetTsRef = useRef<number | null>(null);
  const reactionTimesRef = useRef<number[]>([]);
  const practiseDifficultyRef = useRef(practiseDifficulty);
  const practiseCurrentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [visualCorrect, setVisualCorrect] = useState(0);
  const [visualWrong, setVisualWrong] = useState(0);
  const [visualAnalogValue, setVisualAnalogValue] = useState(36);
  const [visualDigitalValue, setVisualDigitalValue] = useState(360);
  const visualLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visualDirectionRef = useRef<1 | -1>(1);
  const visualStepsUntilTurnRef = useRef<number>(0);

  // Auto-end game logic needs to be handled.
  // The hook useVIGI1GameLogic seems to handle timer?
  // Let's check if it stops automatically. 
  // If not, we might need a useEffect here.
  // Assuming the hook stops the game when time is up.

  // But we need to detect when game ends to show modals.
  // We can track isPlaying change from true to false?
  // Or maybe the hook exposes a "gameFinished" state?
  // Let's look at useVIGI1GameLogic later if needed.
  // For now, I'll assume we need to trigger finish manually or detect it.

  // Actually, VIGI1 usually runs on a timer.
  // If useVIGI1GameLogic doesn't expose "finished", we might need to rely on isPlaying flipping.
  
  // Let's create a wrapper for startGame and stopGame (if exposed).
  
  const handleStartGame = () => {
    if (!checkAccess('vigi1')) return;
    
    // Guest/Free Restrictions
    if (tier !== 'PRO') {
        setGameDuration(120); // 2 minutes
        setAudioDifficulty(1); // Easy
    }
    
    startGame();
  };

  // Detect Game Over
  // We need to know when the game finishes naturally.
  // If the hook manages the timer and sets isPlaying to false when done.
  const prevIsPlayingRef = useRef(false);

  const handleEndGame = useCallback(async () => {
    // Save stats logic moved to stopGame in hook to prevent duplication/inconsistency
    setShowResults(true);
  }, []);

  const handleQuit = () => {
      stopGame();
  };

  useEffect(() => {
    const prev = prevIsPlayingRef.current;
    if (isPlaying) {
        prevIsPlayingRef.current = true;
    } else if (prev) {
        prevIsPlayingRef.current = false;
        setTimeout(() => handleEndGame(), 0);
    }
  }, [isPlaying, handleEndGame]);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    practiseDifficultyRef.current = practiseDifficulty;
  }, [practiseDifficulty]);
  const stopPractise = () => {
    setIsPractiseRunning(false);
    practiseRunningRef.current = false;
    if (practiseTimerRef.current) clearInterval(practiseTimerRef.current);
    if (practiseToneRef.current) clearInterval(practiseToneRef.current);
    if (practiseToneTimeoutRef.current) clearTimeout(practiseToneTimeoutRef.current);
    if (visualLoopRef.current) clearInterval(visualLoopRef.current);
    if (practiseCurrentAudioRef.current) {
      try {
        practiseCurrentAudioRef.current.pause();
        practiseCurrentAudioRef.current.currentTime = 0;
      } catch { void 0; }
      practiseCurrentAudioRef.current = null;
    }
  };
  const prevPractiseDurationMinutesRef = useRef(practiseDurationMinutes);
  
  useEffect(() => {
    if (isPractiseRunning && practiseDurationMinutes !== prevPractiseDurationMinutesRef.current) {
        const diffMinutes = practiseDurationMinutes - prevPractiseDurationMinutesRef.current;
        setPractiseTimeLeft(prev => prev + (diffMinutes * 60));
    }
    prevPractiseDurationMinutesRef.current = practiseDurationMinutes;
  }, [practiseDurationMinutes, isPractiseRunning]);

  const beginVisualPractiseLoops = () => {
    setIsPractiseRunning(true);
    practiseRunningRef.current = true;
    if (practiseTimerRef.current) clearInterval(practiseTimerRef.current);
    if (visualLoopRef.current) clearInterval(visualLoopRef.current);
    
    // Timer
    practiseTimerRef.current = setInterval(() => {
      setPractiseTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          stopPractise();
          setShowPractiseSummary(true);
        }
        return next > 0 ? next : 0;
      });
    }, 1000);

    // Visual Loop
    visualLoopRef.current = setInterval(() => {
      if (!practiseRunningRef.current) return;
      
      setVisualAnalogValue(prevAnalog => {
        // Movement Logic
        visualStepsUntilTurnRef.current--;
        if (visualStepsUntilTurnRef.current <= 0) {
            visualDirectionRef.current = Math.random() < 0.5 ? 1 : -1;
            visualStepsUntilTurnRef.current = Math.floor(Math.random() * 8) + 3;
        }

        let nextAnalog = prevAnalog + visualDirectionRef.current;
        if (nextAnalog > 36) nextAnalog = 1;
        if (nextAnalog < 1) nextAnalog = 36;

        // Mismatch Logic
        // Difficulty 1-10 -> Mismatch Chance 0.23 - 0.5
        const mismatchChance = 0.2 + (practiseDifficultyRef.current * 0.03);
        const shouldMismatch = Math.random() < mismatchChance;
        let nextDigital = nextAnalog * 10;

        if (shouldMismatch) {
            const isLagError = Math.random() < 0.6; 
            if (isLagError) {
                let prevPos = nextAnalog - visualDirectionRef.current;
                if (prevPos > 36) prevPos = 1;
                if (prevPos < 1) prevPos = 36;
                nextDigital = prevPos * 10;
            } else {
                 const offset = Math.random() < 0.5 ? -10 : 10;
                 nextDigital += offset;
            }
            if (nextDigital < 0) nextDigital += 360;
            if (nextDigital === nextAnalog * 10) nextDigital += 10;
        }

        setVisualDigitalValue(nextDigital);
        return nextAnalog;
      });
    }, 1000);
  };
  const beginAudioPractiseLoops = () => {
    setIsPractiseRunning(true);
    practiseRunningRef.current = true;
    if (practiseTimerRef.current) clearInterval(practiseTimerRef.current);
    if (practiseToneRef.current) clearInterval(practiseToneRef.current);
    if (practiseToneTimeoutRef.current) clearTimeout(practiseToneTimeoutRef.current);
    practiseTimerRef.current = setInterval(() => {
      setPractiseTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          stopPractise();
          setShowPractiseSummary(true);
        }
        return next > 0 ? next : 0;
      });
    }, 1000);
    const tones = ['ince', 'orta', 'kalin'];
    const playNextTone = () => {
      if (!practiseRunningRef.current) return;
      practiseCanClickRef.current = true;
      let t: string;
      if (practiseSeriesRemainingRef.current > 0 && practiseSeriesToneRef.current) {
        t = practiseSeriesToneRef.current;
        practiseSeriesRemainingRef.current -= 1;
      } else {
        // Decide whether to start a triple series with small probability
        const startSeriesChance = 0.15 + (practiseDifficultyRef.current - 1) * 0.02; // scales with difficulty
        if (Math.random() < startSeriesChance) {
          t = tones[Math.floor(Math.random() * tones.length)];
          practiseSeriesToneRef.current = t;
          practiseSeriesRemainingRef.current = 2; // including current makes 3 total
        } else {
          // Regular random with bias to repeat last
          const h = practiseToneHistoryRef.current;
          
          // Check if we just had 3 identical tones
          let forbiddenTone: string | null = null;
          if (h.length >= 3 && h[h.length - 1] === h[h.length - 2] && h[h.length - 2] === h[h.length - 3]) {
             forbiddenTone = h[h.length - 1];
          }

          const forcedRepeatChance = (practiseDifficultyRef.current - 1) * 0.05;
          if (!forbiddenTone && h.length > 0 && Math.random() < forcedRepeatChance) {
            t = h[h.length - 1];
          } else {
            let availableTones = tones;
            if (forbiddenTone) {
                availableTones = tones.filter(tone => tone !== forbiddenTone);
            }
            t = availableTones[Math.floor(Math.random() * availableTones.length)];
          }
          practiseSeriesToneRef.current = null;
          practiseSeriesRemainingRef.current = 0;
        }
      }
      const audio = new Audio(`/${t}.m4a`);
      practiseCurrentAudioRef.current = audio;
      audio.play().catch(() => {});
      setTimeout(() => {
        if (practiseCurrentAudioRef.current === audio) {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch { void 0; }
        }
      }, 1000);
      const h = practiseToneHistoryRef.current;
      h.push(t);
      if (h.length > 3) h.shift();
      if (h.length === 3 && h[0] === h[1] && h[1] === h[2]) {
        practiseTargetActiveRef.current = true;
        practiseTargetTsRef.current = Date.now();
        practiseToneHistoryRef.current = [];
      } else {
        if (practiseTargetActiveRef.current) {
          practiseTargetActiveRef.current = false;
        }
      }
      // Schedule next tone after 1s gap (1s tone + 1s silence)
      practiseToneTimeoutRef.current = setTimeout(playNextTone, 2000);
    };
    playNextTone();
  };
  const startAudioPractise = useCallback((opts?: { resume?: boolean; remaining?: number }) => {
    setPractiseMode('AUDIO');
    setIsPractiseSelectOpen(false);
    setIsPractiseRunning(false);
    setIsAudioPrimed(false);
    const durationSec = tier === 'PRO' ? practiseDurationMinutes * 60 : (maxDuration || 120);
    setPractiseTimeLeft(opts?.resume && typeof opts.remaining === 'number' ? opts.remaining : durationSec);
    setAudioCorrect(0);
    setAudioWrong(0);
    setLastReactionMs(null);
    setAvgReactionMs(null);
    setShowPractiseSummary(false);
    reactionTimesRef.current = [];
    practiseToneHistoryRef.current = [];
    practiseTargetActiveRef.current = false;
    practiseCanClickRef.current = true;
  }, [tier, maxDuration, practiseDurationMinutes]);
  const startVisualPractise = useCallback((opts?: { resume?: boolean; remaining?: number }) => {
    setPractiseMode('VISUAL');
    setIsPractiseSelectOpen(false);
    setIsPractiseRunning(false);
    const durationSec = tier === 'PRO' ? practiseDurationMinutes * 60 : (maxDuration || 120);
    setPractiseTimeLeft(opts?.resume && typeof opts.remaining === 'number' ? opts.remaining : durationSec);
    setVisualCorrect(0);
    setVisualWrong(0);
    setShowPractiseSummary(false);
    
    // Initial positions
    const startPos = Math.floor(Math.random() * 36) + 1;
    setVisualAnalogValue(startPos);
    setVisualDigitalValue(startPos * 10);
    visualDirectionRef.current = 1;
  }, [tier, maxDuration, practiseDurationMinutes]);

  const pausePractise = () => {
    if (!isPractiseRunning) return;
    setIsPractiseRunning(false);
    practiseRunningRef.current = false;
    if (practiseTimerRef.current) clearInterval(practiseTimerRef.current);
    if (practiseToneRef.current) clearInterval(practiseToneRef.current);
    if (visualLoopRef.current) clearInterval(visualLoopRef.current);
    if (practiseToneTimeoutRef.current) clearTimeout(practiseToneTimeoutRef.current);
    if (practiseCurrentAudioRef.current) {
      try {
        practiseCurrentAudioRef.current.pause();
        practiseCurrentAudioRef.current.currentTime = 0;
      } catch { void 0; }
      practiseCurrentAudioRef.current = null;
    }
  };

  const resumePractise = () => {
    if (isPractiseRunning || showPractiseSummary) return;
    if (practiseMode === 'AUDIO') {
        beginAudioPractiseLoops();
    } else if (practiseMode === 'VISUAL') {
        beginVisualPractiseLoops();
    }
  };
  
  const handleVisualPractiseEyePress = () => {
    if (practiseMode !== 'VISUAL' || !isPractiseRunning) return;
    
    const expected = visualAnalogValue * 10;
    if (visualDigitalValue !== expected) {
        setVisualCorrect(prev => prev + 1);
    } else {
        setVisualWrong(prev => prev + 1);
    }
  };
  const handleAudioPractiseNotePress = () => {
    if (practiseMode !== 'AUDIO' || !isPractiseRunning) return;
    if (!practiseCanClickRef.current) return;
    practiseCanClickRef.current = false;
    if (practiseTargetActiveRef.current && practiseTargetTsRef.current) {
      const ms = Date.now() - practiseTargetTsRef.current;
      reactionTimesRef.current.push(ms);
      setLastReactionMs(ms);
      const avg = Math.round(reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length);
      setAvgReactionMs(avg);
      setAudioCorrect(prev => prev + 1);
      practiseTargetActiveRef.current = false;
    } else {
      setAudioWrong(prev => prev + 1);
    }
  };
  useEffect(() => {
    return () => {
      if (practiseTimerRef.current) clearInterval(practiseTimerRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (practiseToneRef.current) clearInterval(practiseToneRef.current);
      if (practiseToneTimeoutRef.current) clearTimeout(practiseToneTimeoutRef.current);
      if (visualLoopRef.current) clearInterval(visualLoopRef.current);
      if (practiseCurrentAudioRef.current) {
        try {
          practiseCurrentAudioRef.current.pause();
          practiseCurrentAudioRef.current.currentTime = 0;
        } catch { void 0; }
        practiseCurrentAudioRef.current = null;
      }
    };
  }, []);
  const upgradeForPractise = () => {
    try {
      const snapshot = {
        mode: practiseMode,
        remaining: practiseTimeLeft,
        duration: practiseDurationMinutes,
        difficulty: practiseDifficulty
      };
      localStorage.setItem('resume_practise', JSON.stringify(snapshot));
    } catch { void 0; }
    handleUpgrade('practise-settings');
  };
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('source');
      if (source === 'practise-settings' && tier === 'PRO') {
        const raw = localStorage.getItem('resume_practise');
        if (raw) {
          localStorage.removeItem('resume_practise');
          const snap = JSON.parse(raw);
          if (snap) {
             const duration = snap.duration || 2;
             const difficulty = snap.difficulty || 5;
             const remaining = snap.remaining || duration * 60;

             setTimeout(() => {
                 setPractiseDurationMinutes(duration);
                 setPractiseDifficulty(difficulty);
                 if (snap.mode === 'AUDIO') {
                   startAudioPractise({ resume: true, remaining });
                 } else if (snap.mode === 'VISUAL') {
                   startVisualPractise({ resume: true, remaining });
                 }
             }, 0);
          }
        }
      }
    } catch { void 0; }
  }, [tier, startAudioPractise, startVisualPractise, practiseDurationMinutes]);

  return (
    <div className="relative w-full h-screen bg-gray-200 flex flex-col items-center justify-center font-sans select-none">
      <Toaster position="top-center" />
      <ProAccessModal isOpen={showProModal} onClose={closeProModal} onUpgrade={handleUpgrade} />
      <SmartLoginGate
        isOpen={showLoginGate}
        onClose={() => {
            closeLoginGate();
            toast('Giriş yapmalısın.', { icon: '🔒' });
        }}
        onLoginSuccess={() => {
            closeLoginGate();
            const pending = localStorage.getItem('pending_pro_upgrade');
            if (pending) {
                localStorage.removeItem('pending_pro_upgrade');
                handleUpgrade('vigi1-login');
            } else {
                handleStartGame();
            }
        }}
      />
      
      {/* Top Left Stats */}
      {isPlaying && (
      <div className="absolute top-4 left-4 flex gap-4 text-gray-800 z-[1000]">
         <div className="bg-white px-4 py-2 rounded shadow">
             <span className="font-bold">SCORE:</span> {score}
         </div>
         <div className="bg-white px-4 py-2 rounded shadow">
             <span className="font-bold">TIME:</span> {formatTime(gameTime)}
         </div>
      </div>
      )}

      {/* Top Right Standard Menu */}
      {isPlaying && (
      <div className="absolute top-4 right-4 z-[2000] flex flex-col gap-3">
            {/* Tutorial */}
            <button 
              onClick={() => {
                  if (isPlaying && !isPaused) pauseGame();
                  setIsTutorialOpen(true);
              }}
              className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 group relative border border-slate-700 text-white"
              title="How to Play"
            >
               <HelpCircle size={24} />
            </button>

            {/* Settings */}
            <button 
              onClick={() => {
                  if (isPlaying && !isPaused) pauseGame();
                  setIsSettingsOpen(true);
              }}
              className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 group relative border border-slate-700 text-white"
              title="Settings"
            >
               <Settings size={24} />
            </button>

            {/* Pause/Resume - Only when playing */}
            {isPlaying && (
                <button 
                  onClick={togglePause}
                  className={`p-3 backdrop-blur-sm rounded-full shadow-lg transition-all hover:scale-110 group relative border text-white ${isPaused ? 'bg-amber-600/90 border-amber-500 hover:bg-amber-600' : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'}`}
                  title={isPaused ? "Resume" : "Pause"}
                >
                   {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>
            )}

            {/* Exit */}
            <button 
              onClick={handleQuit}
              className="p-3 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110 group relative border border-red-500 text-white"
              title="End Game & View Stats"
            >
               <LogOut size={24} />
            </button>
      </div>
      )}

      {/* Main Game Area */}
      <div className="relative">
         <AnalogGauge value={analogValue} size={400} />
         <DigitalDisplay value={digitalValue} />
      </div>

      {/* Controls */}
      {isPlaying && (
      <div className="flex gap-16 mt-12">
        {/* Eye Button */}
        <button 
          className="w-24 h-24 bg-white rounded-xl shadow-lg border-2 border-gray-300 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
          onClick={handleEyeClick}
        >
          <Eye size={48} className="text-orange-500" />
        </button>

        {/* Note Button */}
        <button 
          className="w-24 h-24 bg-white rounded-xl shadow-lg border-2 border-gray-300 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
          onClick={handleNoteClick}
        >
          <Music size={48} className="text-blue-500" />
        </button>
      </div>
      )}

      {/* Tutorial Overlay */}
      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        initialLocale="tr"
        title="VIGI 2 (Audio-Visual Vigilance)"
        description="Monitor the gauge and digital display for discrepancies."
        rules={[
          "The analog needle moves randomly (Clockwise/Counter-clockwise).",
          "The digital display should show: Analog Value × 10 (e.g., 3 -> 030).",
          "MISMATCH EXAMPLE: Needle moves to 6, but Digital shows 50 (stuck on previous value).",
          "If the values DO NOT match, press the EYE button immediately.",
          "AUDIO CHALLENGE: Listen to the tones (High, Medium, Low).",
          "If you hear the SAME TONE 3 times in a row, press the NOTE button.",
          "Be quick! You must press before the next tone plays."
        ]}
        controls={[
          { key: "EYE Button", action: "Report Visual Mismatch", icon: <Eye /> },
          { key: "NOTE Button", action: "Report 3 Consecutive Tones", icon: <Music /> }
        ]}
        translations={{
          tr: {
            title: "VIGI 2 (Görsel-İşitsel Uyanıklık)",
            description: "İbreyi ve dijital ekranı uyuşmazlık için izle.",
            rules: [
              "Analog ibre rastgele hareket eder (Saat yönü / ters yönde).",
              "Dijital ekranda: Analog Değer × 10 gösterilmelidir (ör. 3 -> 030).",
              "UYUŞMAZLIK ÖRNEĞİ: İbre 6’ya gelir, dijital 50 gösterir (önceki değerde takılı).",
              "Değerler UYUŞMAZSA hemen GÖZ butonuna bas.",
              "İŞİTSEL GÖREV: Tonları dinle (Yüksek, Orta, Düşük).",
              "Aynı ton art arda 3 kez çalarsa NOTA butonuna bas.",
              "Hızlı ol! Sonraki ton çalmadan basmalısın."
            ],
            controls: [
              { key: "GÖZ", action: "Görsel Uyuşmazlık Bildir", icon: <Eye /> },
              { key: "NOTA", action: "3 Ardışık Tonu Bildir", icon: <Music /> }
            ],
            ctaText: "Tamam"
          }
        }}
      />

      {/* Start Menu Overlay */}
      {!isPlaying && !showResults && !showMiniExamModal && (
        <GameStartMenu 
            title="VIGI 2"
            startLabel={score > 0 ? "PLAY AGAIN" : "EXAM MODE"}
            onStart={handleStartGame}
            onSettings={() => setIsSettingsOpen(true)}
            onPractice={() => setIsPractiseSelectOpen(true)}
            onLearn={() => setIsTutorialOpen(true)}
            onBack={onExit}
            tier={tier}
        />
      )}

      <MiniExamEndModal
        isOpen={showMiniExamModal}
        onClose={() => setShowMiniExamModal(false)}
        onUpgrade={() => {
            setShowMiniExamModal(false);
            if (tier === 'GUEST') {
                localStorage.setItem('pending_pro_upgrade', 'true');
                openLoginGate();
            } else {
                handleUpgrade('vigi1-end');
            }
        }}
        onPractice={() => {
             setShowMiniExamModal(false);
             setIsSettingsOpen(true);
        }}
      />

      <GameResultsModal
        isOpen={showResults}
        score={score}
        duration={formatTime(gameTime)}
        onRetry={() => {
            setShowResults(false);
            handleStartGame();
        }}
        onExit={onExit}
        tier={tier}
      >
        <div className="grid grid-cols-2 gap-3 mb-4 w-full">
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Visual Correct</div>
                <div className="text-lg font-bold text-green-400">{caughtEvents}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Audio Correct</div>
                <div className="text-lg font-bold text-blue-400">{caughtAudio}</div>
            </div>
            
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Visual Missed</div>
                <div className="text-lg font-bold text-yellow-400">{totalEvents - caughtEvents}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Audio Missed</div>
                <div className="text-lg font-bold text-yellow-400">{audioEvents - caughtAudio}</div>
            </div>

            <div className="col-span-2 bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Total Wrong</div>
                <div className="text-lg font-bold text-red-400">{wrongMoves + wrongAudio}</div>
            </div>

            <div className="col-span-2 bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Average Reaction</div>
                <div className="text-xl font-bold text-cyan-400">{Math.round(avgReactionTime)} ms</div>
            </div>
        </div>
      </GameResultsModal>

      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="VIGI 1 Settings"
      >
        <SettingsSection title="Game Duration">
                    <SettingsLabel>Duration (Minutes)</SettingsLabel>
                    <SettingsRange 
                        value={gameDuration / 60}
                        min={1}
                        max={10}
                        step={1}
                        onChange={(val) => setGameDuration(val * 60)}
                        leftLabel="1 min"
                        rightLabel="10 min"
                        valueLabel={<>Duration: <span className="text-purple-600 font-bold">{gameDuration / 60} min</span></>}
                        isLocked={tier !== 'PRO'}
                        onLockedClick={openProModal}
                    />
                </SettingsSection>
                
                <SettingsSection title="Audio Challenge">
                    <SettingsLabel>Same Tone Frequency</SettingsLabel>
                    <SettingsRange 
                        value={audioDifficulty}
                        min={1}
                        max={10}
                        step={1}
                        onChange={setAudioDifficulty}
                        leftLabel="Low"
                        rightLabel="High"
                        valueLabel={<>Difficulty: <span className="text-purple-600 font-bold">{audioDifficulty}</span></>}
                        isLocked={tier !== 'PRO'}
                        onLockedClick={openProModal}
                    />
                </SettingsSection>
            </GameSettingsModal>

      {isPractiseSelectOpen && practiseMode === 'NONE' && (
        <div className="fixed inset-0 z-[3000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="text-xl font-bold text-slate-900 mb-4">Practise Mode</div>
            <div className="space-y-3">
              <button
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                onClick={() => startAudioPractise()}
              >
                Audio Practise
              </button>
              <button
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                onClick={() => startVisualPractise()}
              >
                Visual Practise
              </button>
              <button
                className="w-full py-3 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                onClick={() => setIsPractiseSelectOpen(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {practiseMode === 'VISUAL' && (
        <div className="fixed inset-0 z-[2500] bg-slate-50 flex flex-col items-center justify-center">
          {!isPractiseRunning && !showPractiseSummary && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2600]">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl text-center">
                <div className="text-xl font-bold text-slate-900 mb-2">Visual Practise</div>
                <div className="text-slate-700 mb-4">İbre ve dijital ekran uyuşmadığında Göz tuşuna bas</div>
                <button
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  onClick={() => beginVisualPractiseLoops()}
                >
                  Hazırım
                </button>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded shadow text-slate-800">
              TIME: {formatTime(practiseTimeLeft)}
            </div>
            <div className="px-4 py-2 bg-white rounded shadow text-slate-800">
              Doğru: {visualCorrect}
            </div>
            <div className="px-4 py-2 bg-white rounded shadow text-slate-800">
              Hatalı: {visualWrong}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-3">
            {!isPractiseRunning ? (
              <button
                onClick={resumePractise}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
              >
                Devam Et
              </button>
            ) : (
              <button
                onClick={pausePractise}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
              >
                Durdur
              </button>
            )}
            <button
              onClick={() => {
                stopPractise();
                setPractiseMode('NONE');
                setIsPractiseSelectOpen(true);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Sonlandır
            </button>
          </div>
          
          <div className="relative mb-6 transform scale-75 md:scale-100">
             <AnalogGauge value={visualAnalogValue} size={300} />
             <DigitalDisplay value={visualDigitalValue} />
          </div>

          <div className="flex flex-col items-center gap-4">
             <button
              className="w-28 h-28 bg-white rounded-2xl shadow-lg border-2 border-gray-300 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
              onClick={handleVisualPractiseEyePress}
              disabled={!isPractiseRunning}
            >
              <Eye size={56} className="text-orange-500" />
            </button>
          </div>

          <div className="mt-8 w-full max-w-xl bg-white/80 border border-slate-200 rounded-xl p-4">
            <div className="font-semibold text-slate-800 mb-3">Practise Ayarları</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Süre (dakika)</div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={practiseDurationMinutes}
                  onChange={(e) => setPractiseDurationMinutes(parseInt(e.target.value, 10))}
                  disabled={tier !== 'PRO'}
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-1">Değer: {practiseDurationMinutes} dakika</div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Zorluk (Hata sıklığı)</div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={practiseDifficulty}
                  onChange={(e) => setPractiseDifficulty(parseInt(e.target.value, 10))}
                  disabled={tier !== 'PRO'}
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-1">Değer: {practiseDifficulty}</div>
              </div>
            </div>
            {tier !== 'PRO' && (
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-600">Bu ayarlar PRO üyeler için aktif.</div>
                <button
                  onClick={upgradeForPractise}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  PRO’ya Geç
                </button>
              </div>
            )}
          </div>

          {showPractiseSummary && (
            <div className="fixed inset-0 z-[2600] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="text-xl font-bold text-slate-900 mb-4">Visual Practise Sonuçları</div>
                <div className="space-y-2 text-slate-800">
                  <div>Doğru Basmalar: {visualCorrect}</div>
                  <div>Hatalı Basmalar: {visualWrong}</div>
                  <div>Başarı Oranı: {(visualCorrect + visualWrong) > 0 ? Math.round((visualCorrect / (visualCorrect + visualWrong)) * 100) : 0}%</div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                    onClick={() => startVisualPractise()}
                  >
                    Tekrar
                  </button>
                  <button
                    className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                    onClick={() => {
                      setShowPractiseSummary(false);
                      setPractiseMode('NONE');
                      setIsPractiseSelectOpen(true);
                    }}
                  >
                    Seçime Dön
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {practiseMode === 'AUDIO' && (
        <div className="fixed inset-0 z-[2500] bg-slate-50 flex flex-col items-center justify-center">
          {!isPractiseRunning && !showPractiseSummary && !isAudioPrimed && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl text-center">
                <div className="text-xl font-bold text-slate-900 mb-2">Audio Practise</div>
                <div className="text-slate-700 mb-4">Üç kez aynı sesi duyduğunda Nota tuşuna bas</div>
                <button
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  onClick={() => {
                    setIsAudioPrimed(true);
                    const unlock = new Audio('/orta.m4a');
                    unlock.play().catch(() => {});
                    beginAudioPractiseLoops();
                  }}
                >
                  Hazırım
                </button>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded shadow text-slate-800">
              TIME: {formatTime(practiseTimeLeft)}
            </div>
            <div className="px-4 py-2 bg-white rounded shadow text-slate-800">
              Doğru: {audioCorrect}
            </div>
            <div className="px-4 py-2 bg-white rounded shadow text-slate-800">
              Hatalı: {audioWrong}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-3">
            {!isPractiseRunning ? (
              <button
                onClick={resumePractise}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
              >
                Devam Et
              </button>
            ) : (
              <button
                onClick={pausePractise}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
              >
                Durdur
              </button>
            )}
            <button
              onClick={() => {
                stopPractise();
                setPractiseMode('NONE');
                setIsPractiseSelectOpen(true);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Sonlandır
            </button>
          </div>
          <div className="mt-4 w-full max-w-xl bg-white/80 border border-slate-200 rounded-xl p-4">
            <div className="font-semibold text-slate-800 mb-3">Practise Ayarları</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Süre (dakika)</div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={practiseDurationMinutes}
                  onChange={(e) => setPractiseDurationMinutes(parseInt(e.target.value, 10))}
                  disabled={tier !== 'PRO'}
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-1">Değer: {practiseDurationMinutes} dakika</div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Zorluk (Tekrarlama eğilimi)</div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={practiseDifficulty}
                  onChange={(e) => setPractiseDifficulty(parseInt(e.target.value, 10))}
                  disabled={tier !== 'PRO'}
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-1">Değer: {practiseDifficulty}</div>
              </div>
            </div>
            {tier !== 'PRO' && (
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-600">Bu ayarlar PRO üyeler için aktif.</div>
                <button
                  onClick={upgradeForPractise}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  PRO’ya Geç
                </button>
              </div>
            )}
          </div>
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-slate-900 mb-2">Audio Practise</div>
            <div className="text-slate-600">Üç kez aynı tonu duyarsan Nota tuşuna bas</div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="text-slate-700">
              Son Basış Hızı: {lastReactionMs !== null ? `${lastReactionMs} ms` : '—'}
            </div>
            <div className="text-slate-700">
              Ortalama Hız: {avgReactionMs !== null ? `${avgReactionMs} ms` : '—'}
            </div>
            <button
              className="w-28 h-28 bg-white rounded-2xl shadow-lg border-2 border-gray-300 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
              onClick={handleAudioPractiseNotePress}
              disabled={!isPractiseRunning}
            >
              <Music size={56} className="text-blue-600" />
            </button>
          </div>
          {showPractiseSummary && (
            <div className="fixed inset-0 z-[2600] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="text-xl font-bold text-slate-900 mb-4">Audio Practise Sonuçları</div>
                <div className="space-y-2 text-slate-800">
                  <div>Doğru Basmalar: {audioCorrect}</div>
                  <div>Hatalı Basmalar: {audioWrong}</div>
                  <div>Ortalama Hız: {avgReactionMs !== null ? `${avgReactionMs} ms` : '—'}</div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                    onClick={() => startAudioPractise()}
                  >
                    Tekrar
                  </button>
                  <button
                    className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                    onClick={() => {
                      setShowPractiseSummary(false);
                      setPractiseMode('NONE');
                      setIsPractiseSelectOpen(true);
                    }}
                  >
                    Seçime Dön
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default VIGI1Game;
