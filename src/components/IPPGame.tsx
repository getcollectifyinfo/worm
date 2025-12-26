import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Gauge } from './Gauge';

interface IPPGameProps {
  onExit: () => void;
}

interface GameStats {
  correct: number;
  wrong: number;
}

type GaugeId = 'left' | 'top' | 'right';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

const availableKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

const getRandomKeys = () => {
  const shuffled = [...availableKeys].sort(() => 0.5 - Math.random());
  return {
    left: shuffled[0],
    top: shuffled[1],
    right: shuffled[2]
  };
};

export const IPPGame: React.FC<IPPGameProps> = ({ onExit }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [gameOver, setGameOver] = useState(false);
  const [assignments, setAssignments] = useState<{ [key in GaugeId]: string }>(getRandomKeys);
  const assignmentsRef = useRef(assignments); // Ref to track assignments without triggering re-renders/interval resets
  
  // Settings State
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    assignmentsRef.current = assignments;
  }, [assignments]);

  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [stats, setStats] = useState<GameStats>({ correct: 0, wrong: 0 });
  const [gaugeLocks, setGaugeLocks] = useState<{ [key in GaugeId]: boolean }>({ left: false, top: false, right: false });
  
  // Reaction time tracking
  const lockStartTimes = useRef<{ [key in GaugeId]: number | null }>({ left: null, top: null, right: null });
  const [reactionTimes, setReactionTimes] = useState<{ [key in GaugeId]: number | null }>({ left: null, top: null, right: null });
  const recordedReactionTimes = useRef<number[]>([]); // Store all reaction times for average calculation

  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to show hint
  const triggerHint = useCallback((text: string) => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }
    setHintText(text);
    setShowHint(true);
    hintTimeoutRef.current = setTimeout(() => {
      setShowHint(false);
      hintTimeoutRef.current = null;
    }, 1000);
  }, []);

  // Show hint on initial mount (only if started)
  useEffect(() => {
    if (!hasStarted) return;
    const t = setTimeout(() => {
        triggerHint(`LEFT: ${assignments.left} , UP: ${assignments.top} , RIGHT: ${assignments.right}`);
    }, 0);
    return () => clearTimeout(t);
  }, [hasStarted]); 

  // Random reassignment loop - changes ONE key at a time
  useEffect(() => {
    if (!hasStarted || isSettingsOpen) return;
    const reassignmentInterval = setInterval(() => {
      if (gameOver) return;
      
      const gauges: GaugeId[] = ['left', 'top', 'right'];
      const targetGauge = gauges[Math.floor(Math.random() * gauges.length)];
      
      // Get currently used keys from ref to ensure uniqueness
      const currentAssignments = assignmentsRef.current;
      const usedKeys = Object.values(currentAssignments);
      
      // Filter available keys to exclude those currently in use (except the one we are replacing, technically, but simpler to exclude all active ones)
      const validKeys = availableKeys.filter(k => !usedKeys.includes(k));
      
      // Pick a random key from valid keys
      const newKey = validKeys[Math.floor(Math.random() * validKeys.length)];
      
      setAssignments(prev => {
        return {
            ...prev,
            [targetGauge]: newKey
        };
      });

      const nameMap: Record<GaugeId, string> = { left: 'LEFT', top: 'UP', right: 'RIGHT' };
      triggerHint(`${nameMap[targetGauge]} Instrument assigned key: ${newKey}`);

    }, 15000 + Math.random() * 15000); 

    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      clearInterval(reassignmentInterval);
    };
  }, [gameOver, triggerHint, hasStarted, isSettingsOpen]);

  // Timer
  useEffect(() => {
    if (!hasStarted || gameOver || isSettingsOpen) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver, hasStarted, isSettingsOpen]);

  // Exit on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
             setIsSettingsOpen(false);
        } else {
             onExit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit, isSettingsOpen]);

  // Key Down Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || gameOver || isSettingsOpen) return;
      const key = e.key.toUpperCase();
      
      let matched = false;

      // Check all locked gauges
      (Object.keys(gaugeLocks) as GaugeId[]).forEach(gaugeId => {
        if (gaugeLocks[gaugeId]) {
          // This gauge is in red zone
          if (key === assignments[gaugeId]) {
            // Correct key!
            setGaugeLocks(prev => ({ ...prev, [gaugeId]: false })); // Release lock
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
            
            // Calculate and set reaction time
            const startTime = lockStartTimes.current[gaugeId];
            if (startTime) {
                const reactionTime = Date.now() - startTime;
                setReactionTimes(prev => ({ ...prev, [gaugeId]: reactionTime }));
                recordedReactionTimes.current.push(reactionTime); // Add to history
                lockStartTimes.current[gaugeId] = null; // Reset start time

                // Clear reaction time display after 2 seconds
                setTimeout(() => {
                    setReactionTimes(prev => ({ ...prev, [gaugeId]: null }));
                }, 2000);
            }
            
            matched = true;
          }
        }
      });

      if (!matched) {
          // Wrong press
          setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
          // Show current assignments
          triggerHint(`LEFT: ${assignments.left} , UP: ${assignments.top} , RIGHT: ${assignments.right}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gaugeLocks, assignments, gameOver, triggerHint, hasStarted]);

  // Fix: Move reaction times calculation to state to avoid ref access during render
  const [avgReactionTime, setAvgReactionTime] = useState(0);

  useEffect(() => {
    if (gameOver) {
        const times = recordedReactionTimes.current;
        if (times.length > 0) {
            const avg = times.reduce((a, b) => a + b, 0) / times.length;
            setAvgReactionTime(avg);
        } else {
            setAvgReactionTime(0);
        }
    }
  }, [gameOver]);

  const handleRedZoneEnter = (id: GaugeId) => {
    setGaugeLocks(prev => {
        if (!prev[id]) {
            return { ...prev, [id]: true };
        }
        return prev;
    });
  };

  const handleHitMax = (id: GaugeId) => {
      // Set start time when needle hits max (100%)
      if (!lockStartTimes.current[id]) {
           lockStartTimes.current[id] = Date.now();
      }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpeedMultiplier = (diff: Difficulty) => {
    switch (diff) {
      case 'MEDIUM': return 1.2;
      case 'HARD': return 1.5;
      default: return 1;
    }
  };
  const speedMultiplier = getSpeedMultiplier(difficulty);

  return (
    <div className="w-full h-screen bg-[#4a4a4a] flex flex-col items-center justify-center relative p-8">
      {/* Start Screen */}
      {!hasStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <h1 className="text-white text-6xl font-bold mb-12 tracking-wider">IPP GAME</h1>
          <button 
            onClick={() => setHasStarted(true)}
            className="bg-green-500 text-white text-4xl font-bold px-12 py-6 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg border-4 border-green-400"
          >
            START
          </button>
          <button 
            onClick={onExit}
            className="mt-8 text-gray-400 hover:text-white text-xl font-bold transition-colors border-b-2 border-transparent hover:border-white"
          >
            BACK TO MENU
          </button>
        </div>
      )}

      {/* Top Left Exit */}
      <div className="absolute top-8 left-8 flex flex-col items-start z-40">
        <div className="text-white text-xl font-bold mb-1">{formatTime(timer)}</div>
        <button 
          onClick={onExit}
          className="bg-black text-white text-4xl font-bold px-8 py-2 border-2 border-white hover:bg-gray-800 transition-colors"
        >
          EXIT
        </button>
      </div>

      {/* Top Right Settings */}
      <div className="absolute top-8 right-8 z-40">
        <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-all hover:scale-110 group relative border border-white/20"
            title="Settings"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]">
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-600 relative">
                <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Settings</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-lg mb-4 font-semibold">Difficulty</label>
                        <div className="grid grid-cols-3 gap-4">
                            {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all ${
                                        difficulty === level 
                                        ? 'bg-blue-600 text-white shadow-lg scale-105' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <p className="text-gray-400 text-sm mt-4 text-center">
                            {difficulty === 'EASY' && 'Normal Speed'}
                            {difficulty === 'MEDIUM' && '+20% Speed'}
                            {difficulty === 'HARD' && '+50% Speed'}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors mt-4 text-xl"
                    >
                        RESUME
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex flex-col items-center gap-16 scale-75 md:scale-100 relative">
        
        {/* Top Center Gauge */}
        <div className="mb-8 relative flex flex-col items-center">
            {reactionTimes.top !== null && (
                <div className="absolute -top-12 text-red-500 text-3xl font-mono font-bold animate-pulse z-10">
                    {reactionTimes.top}ms
                </div>
            )}
            <Gauge 
                size={300} 
                initialValue={75} 
                isLockedInRed={gaugeLocks.top}
                onRedZoneEnter={() => handleRedZoneEnter('top')}
                onHitMax={() => handleHitMax('top')}
                speedMultiplier={speedMultiplier}
                isPaused={isSettingsOpen}
            />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center gap-16 md:gap-32">
            {/* Left Gauge */}
            <div className="relative flex flex-col items-center">
                {reactionTimes.left !== null && (
                    <div className="absolute -top-12 text-red-500 text-3xl font-mono font-bold animate-pulse z-10">
                        {reactionTimes.left}ms
                    </div>
                )}
                <Gauge 
                    size={300} 
                    initialValue={25} 
                    isLockedInRed={gaugeLocks.left}
                    onRedZoneEnter={() => handleRedZoneEnter('left')}
                    onHitMax={() => handleHitMax('left')}
                    speedMultiplier={speedMultiplier}
                    isPaused={isSettingsOpen}
                />
            </div>

            {/* Center Digital Display & Hint */}
            <div className="relative flex flex-col items-center justify-center w-64">
                <div className="bg-[#2a2a2a] px-16 py-6 border border-gray-600 shadow-inner">
                    <span className="text-[#22c55e] text-6xl font-mono font-bold tracking-widest">
                        70
                    </span>
                </div>
                {/* Hint Text */}
                <div className={`absolute top-full mt-8 left-1/2 -translate-x-1/2 text-yellow-400 font-mono text-xl font-bold transition-opacity duration-300 whitespace-nowrap text-center ${showHint ? 'opacity-100' : 'opacity-0'}`}>
                    {hintText}
                </div>
            </div>

            {/* Right Gauge */}
            <div className="relative flex flex-col items-center">
                {reactionTimes.right !== null && (
                    <div className="absolute -top-12 text-red-500 text-3xl font-mono font-bold animate-pulse z-10">
                        {reactionTimes.right}ms
                    </div>
                )}
                <Gauge 
                    size={300} 
                    initialValue={80} 
                    isLockedInRed={gaugeLocks.right}
                    onRedZoneEnter={() => handleRedZoneEnter('right')}
                    onHitMax={() => handleHitMax('right')}
                    speedMultiplier={speedMultiplier}
                    isPaused={isSettingsOpen}
                />
            </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <h2 className="text-white text-6xl font-bold mb-8">GAME OVER</h2>
          <div className="text-white text-2xl mb-4">Correct Presses: <span className="text-green-500">{stats.correct}</span></div>
          <div className="text-white text-2xl mb-4">Wrong Presses: <span className="text-red-500">{stats.wrong}</span></div>
          <div className="text-white text-2xl mb-8">
            Avg Reaction Time: <span className="text-yellow-400">
              {avgReactionTime.toFixed(0)}ms
            </span>
          </div>
          <button 
            onClick={onExit}
            className="bg-white text-black text-2xl font-bold px-8 py-4 rounded hover:bg-gray-200 transition-colors"
          >
            BACK TO MENU
          </button>
        </div>
      )}
    </div>
  );
};
