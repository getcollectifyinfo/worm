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
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [gameOver, setGameOver] = useState(false);
  const [assignments, setAssignments] = useState<{ [key in GaugeId]: string }>(getRandomKeys);
  const assignmentsRef = useRef(assignments); // Ref to track assignments without triggering re-renders/interval resets

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

  // Show hint on initial mount
  useEffect(() => {
    const t = setTimeout(() => {
        triggerHint(`LEFT: ${assignments.left} , UP: ${assignments.top} , RIGHT: ${assignments.right}`);
    }, 0);
    return () => clearTimeout(t);
  }, []); 

  // Random reassignment loop - changes ONE key at a time
  useEffect(() => {
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
  }, [gameOver, triggerHint]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
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
  }, [gameOver]);

  // Key Down Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
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
  }, [gaugeLocks, assignments, gameOver, triggerHint]);

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

  return (
    <div className="w-full h-screen bg-[#4a4a4a] flex flex-col items-center justify-center relative p-8">
      {/* Top Left Exit */}
      <div className="absolute top-8 left-8 flex flex-col items-start">
        <div className="text-white text-xl font-bold mb-1">{formatTime(timer)}</div>
        <button 
          onClick={onExit}
          className="bg-black text-white text-4xl font-bold px-8 py-2 border-2 border-white hover:bg-gray-800 transition-colors"
        >
          EXIT
        </button>
      </div>

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
              {recordedReactionTimes.current.length > 0 
                ? (recordedReactionTimes.current.reduce((a, b) => a + b, 0) / recordedReactionTimes.current.length).toFixed(0) 
                : 0}ms
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
