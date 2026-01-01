import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Settings, RotateCcw, RotateCw, Circle, Square, Triangle, Zap, Move, X, Globe } from 'lucide-react';
import { SettingsSection, SettingsRange } from '../GameSettingsModal';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';
import { toast } from 'react-hot-toast';

interface VIGIPracticeProps {
  onExit: () => void;
  tier: 'GUEST' | 'FREE' | 'PRO';
}

const SHAPES = ['circle', 'square', 'triangle'] as const;
const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308']; // Red, Blue, Green, Yellow

const translations = {
  TR: {
    title: 'Pratik Modu',
    movement: {
      title: 'Hareket',
      desc: 'Şekil 1-2-3-4 arasında doğrusal hareket eder ve geri döner.',
    },
    detect: {
      title: 'Değişiklikleri Yakala',
      desc: 'Şu değişiklikleri gördüğünde ilgili tuşa bas:',
      color: 'Renk: Şekil renk değiştirir',
      shape: 'Şekil: Şekil form değiştirir',
      turn: 'Dönüş: Yön beklenmedik şekilde değişir',
      jump: 'Atlama: Bir pozisyon atlar (örn. 1→3)',
    },
    buttons: {
      ready: 'Hazırım!',
      back: 'Menüye Dön',
    },
  },
  EN: {
    title: 'Practice Mode',
    movement: {
      title: 'Movement',
      desc: 'Shape moves linearly 1-2-3-4 then reverses.',
    },
    detect: {
      title: 'Detect Changes',
      desc: 'Press buttons when you see:',
      color: 'Color: Shape changes color',
      shape: 'Shape: Shape changes form',
      turn: 'Turn: Direction reverses unexpectedly',
      jump: 'Jump: Skips a position (e.g. 1→3)',
    },
    buttons: {
      ready: "I'm Ready!",
      back: 'Back to Menu',
    },
  },
};

export const VIGIPractice: React.FC<VIGIPracticeProps> = ({ onExit, tier }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('TR');
  
  // Settings
  const [speed, setSpeed] = useState(2000); // ms per step (Slow default)
  const [duration, setDuration] = useState(2); // minutes
  const [frequency, setFrequency] = useState(0.3); // Change chance 0-1
  
  // Game State
  const [position, setPosition] = useState(1); // 1-4
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentShape, setCurrentShape] = useState<typeof SHAPES[number]>('circle');
  const [currentColor, setCurrentColor] = useState(COLORS[1]); // Blue default
  const [direction, setDirection] = useState<1 | -1>(1); // 1: Right, -1: Left
  const [transitionDuration, setTransitionDuration] = useState(300); // ms
  
  // Stats
  const [score, setScore] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  
  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEventRef = useRef<{ type: 'COLOR' | 'SHAPE' | 'TURN' | 'JUMP', timestamp: number } | null>(null);
  const settingsRef = useRef({ speed, frequency });
  const eventHandledRef = useRef(false);
  const stateRef = useRef({ position: 1, direction: 1, shape: 'circle', color: COLORS[1] });

  // Update refs when settings change
  useEffect(() => {
    settingsRef.current = { speed, frequency };
  }, [speed, frequency]);

  // Update state ref
  useEffect(() => {
    stateRef.current = { position, direction, shape: currentShape, color: currentColor };
  }, [position, direction, currentShape, currentColor]);

  // Duration change logic
  const prevDurationRef = useRef(duration);
  useEffect(() => {
    if (isPlaying && duration !== prevDurationRef.current) {
        const diff = duration - prevDurationRef.current;
        setTimeLeft(prev => prev + (diff * 60));
    }
    prevDurationRef.current = duration;
  }, [duration, isPlaying]);

  const { handleUpgrade } = useGameAccess();

  // 1. Define stopGame first
  const stopGame = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
  }, []);

  // 2. Define runGameStep
  const runGameStep = useCallback(() => {
    const { position: pos, direction: dir, shape, color } = stateRef.current;
    
    let nextPos = pos + dir;
    let nextDir = dir as 1 | -1;
    let nextShape = shape as typeof SHAPES[number];
    let nextColor = color;
    let eventType: 'COLOR' | 'SHAPE' | 'TURN' | 'JUMP' | null = null;

    if (Math.random() < settingsRef.current.frequency) {
        const eventRoll = Math.random();
        if (eventRoll < 0.25) {
            const otherColors = COLORS.filter(c => c !== color);
            nextColor = otherColors[Math.floor(Math.random() * otherColors.length)];
            eventType = 'COLOR';
        } else if (eventRoll < 0.5) {
            const otherShapes = SHAPES.filter(s => s !== shape);
            nextShape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
            eventType = 'SHAPE';
        } else if (eventRoll < 0.75) {
            nextDir = (dir * -1) as 1 | -1;
            nextPos = pos + nextDir;
            eventType = 'TURN';
        } else {
            nextPos = pos + (dir * 2);
            eventType = 'JUMP';
        }
    }

    // Wrap logic
    let isWrap = false;
    if (nextPos > 4) {
        nextPos -= 4;
        isWrap = true;
    }
    if (nextPos < 1) {
        nextPos += 4;
        isWrap = true;
    }

    // Update React State
    setTransitionDuration(isWrap ? 0 : 300);
    setPosition(nextPos);
    setDirection(nextDir);
    setCurrentShape(nextShape);
    setCurrentColor(nextColor);
    
    eventHandledRef.current = false;
    if (eventType) {
        lastEventRef.current = { type: eventType, timestamp: Date.now() };
    } else {
        lastEventRef.current = null;
    }

    // Schedule next step in useEffect instead to avoid hoisting issues or use a ref
    // We can't call runGameStep here directly because of hoisting/closure
    // Instead we use a flag or just rely on the Effect to pick it up if we change a dep?
    // No, runGameStep is recursive in logic.
    // Solution: Use a ref to hold the function
  }, []);

  const runGameStepRef = useRef(runGameStep);
  useEffect(() => {
    runGameStepRef.current = runGameStep;
  }, [runGameStep]);

  // Use another effect to trigger the loop
  useEffect(() => {
    if (isPlaying && !isPaused) {
      const loop = () => {
         runGameStepRef.current();
         gameLoopRef.current = setTimeout(loop, settingsRef.current.speed);
      };
      gameLoopRef.current = setTimeout(loop, settingsRef.current.speed);
    }
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [isPlaying, isPaused]);

  // 4. Start Game
  const startGame = () => {
    setShowRules(false);
    setIsPlaying(true);
    setIsPaused(false);
    setScore(0);
    setCorrectClicks(0);
    setWrongClicks(0);
    setReactionTimes([]);
    setTimeLeft(duration * 60);
    setPosition(1);
    setDirection(1);
    setCurrentShape('circle');
    setCurrentColor(COLORS[1]);
    lastEventRef.current = null;
    eventHandledRef.current = false;
    
    // Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAction = (action: 'COLOR' | 'SHAPE' | 'TURN' | 'JUMP') => {
    if (!isPlaying || isPaused) return;
    
    if (lastEventRef.current && lastEventRef.current.type === action && !eventHandledRef.current) {
        // Correct!
        const reactionTime = Date.now() - lastEventRef.current.timestamp;
        setReactionTimes(prev => [...prev, reactionTime]);
        setCorrectClicks(prev => prev + 1);
        setScore(prev => prev + 10);
        eventHandledRef.current = true;
        toast.success('Nice!', { duration: 500, position: 'top-center', icon: '👍' });
    } else {
        // Wrong!
        setWrongClicks(prev => prev + 1);
        setScore(prev => Math.max(0, prev - 5));
        toast.error('Wrong!', { duration: 500, position: 'top-center' });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderShape = () => {
    const style = { color: currentColor, fill: currentColor };
    const size = 48;
    switch (currentShape) {
        case 'square': return <Square size={size} style={style} fill={currentColor} />;
        case 'triangle': return <Triangle size={size} style={style} fill={currentColor} />;
        default: return <Circle size={size} style={style} fill={currentColor} />;
    }
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
    if (isPlaying) {
        setIsPaused(false);
    }
  };

  // Render Rules Modal
  if (showRules) {
      const t = translations[language];
      return (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm p-4">
              <div className="bg-gray-800 p-8 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl relative">
                  {/* Language Toggle */}
                  <button 
                      onClick={() => setLanguage(l => l === 'TR' ? 'EN' : 'TR')}
                      className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-300 transition-colors"
                  >
                      <Globe size={16} />
                      {language === 'TR' ? 'EN' : 'TR'}
                  </button>

                  <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t.title}</h2>
                  
                  <div className="space-y-4 mb-8 text-gray-300">
                      <div className="flex items-start gap-3">
                          <div className="bg-blue-900/50 p-2 rounded-lg"><Move size={20} className="text-blue-400" /></div>
                          <div>
                              <div className="font-bold text-white">{t.movement.title}</div>
                              <div className="text-sm">{t.movement.desc}</div>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <div className="bg-purple-900/50 p-2 rounded-lg"><Zap size={20} className="text-purple-400" /></div>
                          <div>
                              <div className="font-bold text-white">{t.detect.title}</div>
                              <div className="text-sm">{t.detect.desc}</div>
                              <ul className="text-sm list-disc list-inside mt-1 space-y-1 text-gray-400">
                                  <li>{t.detect.color}</li>
                                  <li>{t.detect.shape}</li>
                                  <li>{t.detect.turn}</li>
                                  <li>{t.detect.jump}</li>
                              </ul>
                          </div>
                      </div>
                  </div>

                  <div className="flex flex-col gap-3">
                      <button 
                          onClick={startGame}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/20"
                      >
                          {t.buttons.ready}
                      </button>
                      <button 
                          onClick={onExit}
                          className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-gray-300 transition-all"
                      >
                          {t.buttons.back}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-mono select-none overflow-hidden">
      <ProAccessModal isOpen={showSettings && tier !== 'PRO'} onClose={handleCloseSettings} onUpgrade={handleUpgrade} />
      
      {/* Settings Modal */}
      {showSettings && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleCloseSettings}>
              <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-md m-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Practice Settings</h3>
                      <button onClick={handleCloseSettings} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="space-y-6">
                      <SettingsSection title="Game Speed">
                          <SettingsRange 
                              value={3000 - speed} 
                              min={500} 
                              max={2500} 
                              step={100} 
                              onChange={(val) => setSpeed(3000 - val)}
                              isLocked={tier !== 'PRO'}
                              onLockedClick={() => handleUpgrade('vigi-practice-settings')}
                              leftLabel="Slow"
                              rightLabel="Fast"
                          />
                      </SettingsSection>

                      <SettingsSection title="Duration">
                          <SettingsRange 
                              value={duration} 
                              min={1} 
                              max={10} 
                              step={1} 
                              onChange={setDuration}
                              isLocked={tier !== 'PRO'}
                              onLockedClick={() => handleUpgrade('vigi-practice-settings')}
                              valueLabel={`${duration} min`}
                          />
                      </SettingsSection>

                      <SettingsSection title="Change Frequency">
                          <SettingsRange 
                              value={frequency * 100} 
                              min={10} 
                              max={90} 
                              step={10} 
                              onChange={(val) => setFrequency(val / 100)}
                              isLocked={tier !== 'PRO'}
                              onLockedClick={() => handleUpgrade('vigi-practice-settings')}
                              valueLabel={`${Math.round(frequency * 100)}%`}
                              leftLabel="Rare"
                              rightLabel="Frequent"
                          />
                      </SettingsSection>
                  </div>

                  <div className="mt-8 text-center text-sm text-gray-500">
                      {tier === 'PRO' ? (
                          <span className="text-green-600 font-medium flex items-center justify-center gap-1">
                              <Zap size={16} /> Changes apply instantly!
                          </span>
                      ) : (
                          <span>Upgrade to PRO to customize these settings.</span>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* HUD */}
      <div className="absolute top-4 w-full px-8 flex justify-between items-start z-10">
        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700 min-w-[120px]">
            <div className="text-xs text-gray-400 font-bold tracking-wider mb-1">SCORE</div>
            <div className="text-3xl font-bold text-yellow-400">{score}</div>
        </div>
        
        <div className="flex flex-col items-center">
            <div className={`text-5xl font-bold font-mono tracking-wider ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {formatTime(timeLeft)}
            </div>
            
            <div className="flex gap-2 mt-4">
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`p-3 rounded-full transition-all hover:scale-110 shadow-lg ${isPaused ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {isPaused ? <Play size={24} fill="white" /> : <Pause size={24} fill="white" />}
                </button>
                <button 
                    onClick={() => {
                        setIsPaused(true);
                        setShowSettings(true);
                    }}
                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-all hover:scale-110 shadow-lg"
                >
                    <Settings size={24} />
                </button>
                <button 
                    onClick={() => {
                        stopGame();
                        setShowRules(true);
                    }}
                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-all hover:scale-110 shadow-lg"
                    title="Restart"
                >
                    <RotateCcw size={24} />
                </button>
                <button 
                    onClick={onExit}
                    className="p-3 bg-red-900/50 text-red-200 rounded-full hover:bg-red-900/80 transition-all hover:scale-110 shadow-lg border border-red-800"
                    title="Exit"
                >
                    <X size={24} />
                </button>
            </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700 text-right min-w-[120px]">
             <div className="text-xs text-gray-400 font-bold tracking-wider mb-1">ACCURACY</div>
             <div className="text-2xl font-bold">
                <span className="text-green-400">{correctClicks}</span>
                <span className="text-gray-500 text-lg"> / {correctClicks + wrongClicks}</span>
             </div>
             {reactionTimes.length > 0 && (
                 <div className="text-xs text-gray-400 mt-2 font-mono">
                    Avg: <span className="text-white font-bold">{Math.round(reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length)}</span> ms
                 </div>
             )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="w-full max-w-4xl px-8 flex-1 flex flex-col justify-center relative">
         {/* Track */}
         <div className="relative h-3 bg-gray-800 rounded-full w-full flex justify-between items-center mb-12 border border-gray-700 shadow-inner">
            {[1, 2, 3, 4].map(step => (
                <div key={step} className="relative z-10">
                    <div className={`w-4 h-4 rounded-full ${step === position ? 'bg-white scale-150 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-gray-700'} transition-all duration-200`} />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-gray-600 font-bold font-mono text-xl">{step}</div>
                </div>
            ))}
            
            {/* Moving Shape */}
            <div 
                className="absolute top-1/2 -translate-y-1/2 ease-linear z-20"
                style={{ 
                    left: `${((position - 1) / 3) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: `left ${transitionDuration}ms linear`
                }}
            >
                <div className="animate-bounce-subtle filter drop-shadow-lg">
                    {renderShape()}
                </div>
            </div>
         </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-4 gap-6 w-full max-w-4xl px-8 pb-12">
        <button 
            onClick={() => handleAction('COLOR')}
            className="h-28 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-2 border-blue-500/50 rounded-2xl hover:bg-blue-800/60 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 group shadow-lg hover:shadow-blue-500/20"
        >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 group-hover:scale-110 transition-transform shadow-lg" />
            <span className="font-bold tracking-wider text-blue-100">COLOR</span>
        </button>

        <button 
            onClick={() => handleAction('SHAPE')}
            className="h-28 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-2 border-purple-500/50 rounded-2xl hover:bg-purple-800/60 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 group shadow-lg hover:shadow-purple-500/20"
        >
            <div className="flex gap-1 group-hover:scale-110 transition-transform">
                <Square size={18} className="text-purple-300" />
                <Circle size={18} className="text-purple-300" />
            </div>
            <span className="font-bold tracking-wider text-purple-100">SHAPE</span>
        </button>

        <button 
            onClick={() => handleAction('TURN')}
            className="h-28 bg-gradient-to-br from-green-900/40 to-green-800/40 border-2 border-green-500/50 rounded-2xl hover:bg-green-800/60 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 group shadow-lg hover:shadow-green-500/20"
        >
            <RotateCw size={32} className="text-green-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-bold tracking-wider text-green-100">TURN</span>
        </button>

        <button 
            onClick={() => handleAction('JUMP')}
            className="h-28 bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-2 border-orange-500/50 rounded-2xl hover:bg-orange-800/60 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 group shadow-lg hover:shadow-orange-500/20"
        >
            <div className="flex gap-1 items-end group-hover:-translate-y-1 transition-transform">
                <div className="w-2 h-2 rounded-full bg-orange-400 opacity-50" />
                <div className="w-2 h-4 rounded-full bg-orange-400 opacity-75" />
                <div className="w-2 h-6 rounded-full bg-orange-400" />
            </div>
            <span className="font-bold tracking-wider text-orange-100">JUMP</span>
        </button>
      </div>
      
      {/* Overlay when paused */}
      {isPaused && !showSettings && (
          <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="text-4xl font-bold text-white tracking-widest animate-pulse">PAUSED</div>
          </div>
      )}
    </div>
  );
};
