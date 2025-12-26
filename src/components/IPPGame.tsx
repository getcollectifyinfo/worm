import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Gauge } from './Gauge';
import { GameStartMenu } from './GameStartMenu';
import { GameTutorial } from './GameTutorial';
import { GameSettingsModal, SettingsSection, SettingsLabel, SettingsRange } from './GameSettingsModal';
import { statsService } from '../services/statsService';

interface IPPGameProps {
  onExit: () => void;
}

interface GameStats {
  correct: number;
  wrong: number;
}

type GaugeId = 'left' | 'top' | 'right';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type CalcRule = 'ADD' | 'DOUBLE_ADD' | 'SUBTRACT' | 'DOUBLE_SUBTRACT';

const availableKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

const getRandomKeys = () => {
  const shuffled = [...availableKeys].sort(() => 0.5 - Math.random());
  return {
    left: shuffled[0],
    top: shuffled[1],
    right: shuffled[2]
  };
};

const getRuleText = (rule: CalcRule) => {
  switch (rule) {
    case 'ADD': return 'Add upcoming numbers';
    case 'DOUBLE_ADD': return 'Add double of upcoming numbers';
    case 'SUBTRACT': return 'Subtract upcoming numbers';
    case 'DOUBLE_SUBTRACT': return 'Subtract double upcoming numbers';
  }
};

const calculateNext = (current: number, num: number, rule: CalcRule) => {
  switch (rule) {
    case 'ADD': return current + num;
    case 'DOUBLE_ADD': return current + (num * 2);
    case 'SUBTRACT': return current - num;
    case 'DOUBLE_SUBTRACT': return current - (num * 2);
  }
};

export const IPPGame: React.FC<IPPGameProps> = ({ onExit }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [gameOver, setGameOver] = useState(false);
  const [assignments, setAssignments] = useState<{ [key in GaugeId]: string }>(getRandomKeys);
  const assignmentsRef = useRef(assignments); // Ref to track assignments without triggering re-renders/interval resets
  
  // Settings State
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameDuration, setGameDuration] = useState(2); // Minutes
  const [ruleChangeFreq, setRuleChangeFreq] = useState(3); // 1-5 scale

  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const showHintRef = useRef(showHint);
  
  useEffect(() => {
    showHintRef.current = showHint;
  }, [showHint]);

  const handleDurationChange = (newDuration: number) => {
    setGameDuration(newDuration);
    if (!hasStarted) {
        setTimer(newDuration * 60);
    }
  };

  useEffect(() => {
    assignmentsRef.current = assignments;
  }, [assignments]);

  // Calculation Game State
  type CalcState = 'IDLE' | 'SHOWING_RULE' | 'SHOWING_NUM_1' | 'SHOWING_NUM_1_WAIT' | 'SHOWING_NUM_2' | 'SHOWING_NUM_2_WAIT' | 'INPUT' | 'FEEDBACK' | 'NEXT_NUM_DELAY' | 'SHOWING_NEXT_NUM' | 'SHOWING_NEXT_NUM_WAIT';

  const [calcState, setCalcState] = useState<CalcState>('IDLE');
  const [currentRule, setCurrentRule] = useState<CalcRule>('ADD');
  const [calcTotal, setCalcTotal] = useState(0);
  const [displayedNumber, setDisplayedNumber] = useState<number | null>(null);
  const [calcInput, setCalcInput] = useState('');
  const [calcFeedback, setCalcFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isInitialRound, setIsInitialRound] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Start Calculation Game Loop
  useEffect(() => {
    if (!hasStarted || gameOver || isSettingsOpen) return;

    // Initial Start
    if (calcState === 'IDLE') {
        // We cannot call setState directly here if it causes a loop or runs on every render
        // But since we check for IDLE, it should be safe. However, React strict mode or effect rules might complain.
        // Let's wrap in a timeout to be safe and break synchronous update cycle.
        const timeout = setTimeout(() => {
            const rules: CalcRule[] = ['ADD', 'DOUBLE_ADD', 'SUBTRACT', 'DOUBLE_SUBTRACT'];
            const randomRule = rules[Math.floor(Math.random() * rules.length)];
            setCurrentRule(randomRule);
            setCalcTotal(0);
            setIsInitialRound(true);
            setCalcState('SHOWING_RULE');
        }, 0);
        return () => clearTimeout(timeout);
    }
  }, [hasStarted, gameOver, isSettingsOpen, calcState]);

  // State Machine for Calculation Game
  useEffect(() => {
    if (!hasStarted || gameOver || isSettingsOpen) return;

    let timeout: ReturnType<typeof setTimeout>;

    switch (calcState) {
        case 'SHOWING_RULE':
            timeout = setTimeout(() => {
                if (isInitialRound) {
                    setCalcState('SHOWING_NUM_1');
                } else {
                    setCalcState('SHOWING_NEXT_NUM');
                }
            }, 1000); // 1 second display for rule
            break;

        case 'SHOWING_NUM_1':
            timeout = setTimeout(() => {
                // Prepare for Num 1 (Base Number)
                let min = 10, max = 50;
                if (currentRule === 'SUBTRACT' || currentRule === 'DOUBLE_SUBTRACT') {
                    min = 100;
                    max = 200;
                }
                const num1 = Math.floor(Math.random() * (max - min)) + min;
                
                setDisplayedNumber(num1);
                // First number sets the base total, rule is not applied yet
                setCalcTotal(num1);
                setCalcState('SHOWING_NUM_1_WAIT');
            }, 0); 
            break;

        case 'SHOWING_NUM_1_WAIT':
            timeout = setTimeout(() => {
                setCalcState('SHOWING_NUM_2');
            }, 2000);
            break;

        case 'SHOWING_NUM_2':
             timeout = setTimeout(() => {
                const num2 = Math.floor(Math.random() * 50) + 10;
                setDisplayedNumber(num2);
                setCalcTotal(prev => calculateNext(prev, num2, currentRule));
                setCalcState('SHOWING_NUM_2_WAIT');
             }, 0);
             break;

        case 'SHOWING_NUM_2_WAIT':
            timeout = setTimeout(() => {
                setDisplayedNumber(null);
                setCalcState('INPUT');
            }, 2000);
            break;

        case 'FEEDBACK':
            timeout = setTimeout(() => {
                setCalcFeedback(null);
                setCalcState('NEXT_NUM_DELAY');
            }, 2000);
            break;


        case 'NEXT_NUM_DELAY':
            // Chance to change rule?
            timeout = setTimeout(() => {
                // If system hint is showing, wait
                if (showHintRef.current) {
                     setCalcState('NEXT_NUM_DELAY'); // Re-trigger delay
                     return;
                }

                // Calculate rule change chance based on setting (1-5)
                // 1: 5%, 2: 15%, 3: 25%, 4: 40%, 5: 60%
                const chances = [0.05, 0.15, 0.25, 0.40, 0.60];
                const chance = chances[ruleChangeFreq - 1] || 0.2;

                if (Math.random() < chance) {
                    const rules: CalcRule[] = ['ADD', 'DOUBLE_ADD', 'SUBTRACT', 'DOUBLE_SUBTRACT'];
                    const newRule = rules[Math.floor(Math.random() * rules.length)];
                    setCurrentRule(newRule);
                    setCalcState('SHOWING_RULE'); 
                } else {
                     setCalcState('SHOWING_NEXT_NUM');
                }
            }, 500); // Check every 500ms if blocked, or just proceed
            break;


        case 'SHOWING_NEXT_NUM':
             // State transition logic moved inside timeout to avoid synchronous setState warning
             // Wait briefly before generating to allow UI to update if needed, 
             // but actually we want immediate transition. 
             // The warning "Calling setState synchronously within an effect" happens if we update state 
             // directly in the switch case body without a condition or timeout.
             // We can wrap the generation in a timeout(0) or just use the timeout for the display duration.
             
             timeout = setTimeout(() => {
                const nextNum = Math.floor(Math.random() * 50) + 10;
                setDisplayedNumber(nextNum);
                setCalcTotal(prev => calculateNext(prev, nextNum, currentRule));
                
                // Then set another timeout to hide it? 
                // We need a way to show it for 2s then go to INPUT.
                // We can't nest timeouts easily in this effect structure if we want clean cleanup.
                // Better: Change state to 'SHOWING_NEXT_NUM_WAIT'
                setCalcState('SHOWING_NEXT_NUM_WAIT');
             }, 0);
            break;

        case 'SHOWING_NEXT_NUM_WAIT':
            timeout = setTimeout(() => {
                setDisplayedNumber(null);
                setCalcState('INPUT');
            }, 2000);
            break;
    }

    return () => clearTimeout(timeout);
  }, [calcState, hasStarted, gameOver, isSettingsOpen, currentRule, isInitialRound, ruleChangeFreq]);

  const handleCalcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(calcInput);
    if (isNaN(val)) return;

    if (val === calcTotal) {
        setCalcFeedback({ isCorrect: true, message: `CORRECT: ${val}` });
    } else {
        setCalcFeedback({ 
            isCorrect: false, 
            message: `Calculation Wrong. Current result is ${calcTotal}\nRule is : "${getRuleText(currentRule)}"`
        });
    }
    setCalcInput('');
    setIsInitialRound(false); // First round complete
    
    // Clear hint if showing to avoid overlap
    if (showHintRef.current) {
        setShowHint(false);
        if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    }
    
    setCalcState('FEEDBACK');
  };

  const [stats, setStats] = useState<GameStats>({ correct: 0, wrong: 0 });
  const [startTime, setStartTime] = useState(0);

  // Handle Game End
  const handleGameEnd = useCallback(async () => {
    setGameOver(true);
    setHasStarted(false);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    const totalQuestions = stats.correct + stats.wrong;
    const score = stats.correct;

    await statsService.saveSession({
        game_type: 'IPP',
        score: score,
        duration_seconds: duration,
        metadata: {
            difficulty: difficulty,
            total_questions: totalQuestions,
            wrong_answers: stats.wrong,
            correct_answers: stats.correct
        }
    });

  }, [stats, startTime, difficulty]);

  const [gaugeLocks, setGaugeLocks] = useState<{ [key in GaugeId]: boolean }>({ left: false, top: false, right: false });
  
  // Reaction time tracking
  const lockStartTimes = useRef<{ [key in GaugeId]: number | null }>({ left: null, top: null, right: null });
  const [reactionTimes, setReactionTimes] = useState<{ [key in GaugeId]: number | null }>({ left: null, top: null, right: null });
  const recordedReactionTimes = useRef<number[]>([]); // Store all reaction times for average calculation

  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State to track if system messages are allowed
  const isMathBusy = ['SHOWING_RULE', 'FEEDBACK'].includes(calcState);

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

  // Use ref to track isMathBusy
  const isMathBusyRef = useRef(isMathBusy);
  useEffect(() => {
    isMathBusyRef.current = isMathBusy;
  }, [isMathBusy]);
  
  // Show hint on initial mount (only if started)
  useEffect(() => {
    if (!hasStarted) return;
    const t = setTimeout(() => {
        triggerHint(`LEFT: ${assignments.left} , UP: ${assignments.top} , RIGHT: ${assignments.right}`);
    }, 0);
    return () => clearTimeout(t);
  }, [hasStarted, assignments, triggerHint]); 

  // Random reassignment loop - changes ONE key at a time
  useEffect(() => {
    if (!hasStarted || isSettingsOpen) return;
    
    const tryReassignment = () => {
        if (gameOver) return;

        // If math is showing important info, delay reassignment
        if (isMathBusyRef.current) {
            setTimeout(tryReassignment, 500);
            return;
        }

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
        
        // Schedule next reassignment
        const nextDelay = 15000 + Math.random() * 15000;
        timeoutId = setTimeout(tryReassignment, nextDelay);
    };

    let timeoutId = setTimeout(tryReassignment, 15000 + Math.random() * 15000);

    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      clearTimeout(timeoutId);
    };
  }, [gameOver, triggerHint, hasStarted, isSettingsOpen]);

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (hasStarted && !gameOver && !isSettingsOpen) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleGameEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, gameOver, isSettingsOpen, handleGameEnd]);

  // Start Game
  const handleStart = () => {
    setHasStarted(true);
    setGameOver(false);
    setStats({ correct: 0, wrong: 0 });
    setTimer(gameDuration * 60);
    setStartTime(Date.now());

    // Reset Game State
    setAssignments(getRandomKeys());
    setGaugeLocks({ left: false, top: false, right: false });
    setReactionTimes({ left: null, top: null, right: null });
    recordedReactionTimes.current = [];
    lockStartTimes.current = { left: null, top: null, right: null };
    
    // Reset Calc State
    setCalcState('IDLE');
    setCalcTotal(0);
    setDisplayedNumber(null);
    setCalcInput('');
    setCalcFeedback(null);
  };

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
  }, [gaugeLocks, assignments, gameOver, triggerHint, hasStarted, isSettingsOpen]);

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
    <div className="w-full h-screen bg-gray-900 text-white p-4 font-mono relative overflow-hidden">
      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="IPP GAME"
        description="Multitasking Challenge! Balance gauge monitoring with mental arithmetic. Keep your focus sharp."
        rules={[
            "Monitor the 3 gauges (Left, Top, Right).",
            "Press the assigned key when a gauge drops too low.",
            "Watch out! Key assignments change periodically.",
            "Solve the math problems shown in the center.",
            "Follow the current math rule (e.g., Add, Subtract).",
            "Type your answer and press Enter."
        ]}
        controls={[
            { key: "A-Z", action: "Reset Gauge (See assignments)", icon: <span className="text-xl">⚡</span> },
            { key: "0-9", action: "Type Answer" },
            { key: "ENTER", action: "Submit Answer" }
        ]}
      />

      {!hasStarted && !isSettingsOpen && !gameOver && (
        <GameStartMenu 
          title="IPP" 
          onStart={handleStart}
          onSettings={() => setIsSettingsOpen(true)}
          onBack={onExit}
          onTutorial={() => setIsTutorialOpen(true)}
        />
      )}

      {/* Top Left Timer */}
      <div className="absolute top-8 left-8 flex flex-col items-start z-40">
        <div className="text-white text-xl font-mono font-bold mb-1 tracking-wider bg-black/40 px-3 py-1 rounded border border-white/10">
            {formatTime(timer)}
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-8 right-8 z-40 flex flex-col gap-4">
        <button 
            onClick={() => setIsTutorialOpen(true)}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-all hover:scale-110 group relative border border-white/20"
            title="How to Play"
        >
            <span className="text-xl font-bold text-white">?</span>
        </button>

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

        <button 
            onClick={onExit}
            className="p-3 bg-red-500/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500/40 transition-all hover:scale-110 group relative border border-red-500/30"
            title="Exit Game"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        </button>
      </div>

      {/* Settings Modal */}
      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="IPP Settings"
      >
        {/* Difficulty */}
        <SettingsSection title="Difficulty">
            <SettingsLabel>Gauge Difficulty</SettingsLabel>
            <div className="grid grid-cols-3 gap-2 mt-2">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
                    <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`p-3 rounded-lg border-2 text-sm font-bold transition-all
                            ${difficulty === d 
                              ? 'border-purple-600 bg-purple-50 text-purple-700' 
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </SettingsSection>

        {/* Duration Slider */}
        <SettingsSection>
             <SettingsRange
                min={2}
                max={12}
                step={1}
                value={gameDuration}
                onChange={handleDurationChange}
                leftLabel="2m"
                rightLabel="12m"
                valueLabel={
                    <>Game Duration: <span className="text-purple-600">{gameDuration} min</span></>
                }
             />
        </SettingsSection>

        {/* Rule Change Frequency Slider */}
        <SettingsSection>
             <SettingsRange
                min={1}
                max={5}
                step={1}
                value={ruleChangeFreq}
                onChange={setRuleChangeFreq}
                leftLabel="Less"
                rightLabel="More"
                valueLabel={
                    <>
                        Math Rule Change: <span className="text-purple-600">
                        {['Very Low', 'Low', 'Medium', 'High', 'Very High'][ruleChangeFreq - 1]}
                        </span>
                    </>
                }
             />
        </SettingsSection>
      </GameSettingsModal>

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

            {/* Center Digital Display & Hint Container */}
                <div className="relative flex flex-col items-center justify-center w-80 h-[300px]">
                    
                    {/* Number Display Area - Fixed Position */}
                    <div className="absolute top-0 w-full">
                         <style>{`
                            input[type=number]::-webkit-inner-spin-button, 
                            input[type=number]::-webkit-outer-spin-button { 
                                -webkit-appearance: none; 
                                margin: 0; 
                            }
                            input[type=number] {
                                -moz-appearance: textfield;
                            }
                        `}</style>

                        <div className="bg-[#2a2a2a] w-full h-32 flex items-center justify-center border-4 border-gray-600 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden relative">
                            {/* Number Display */}
                            {displayedNumber !== null && (
                                <span className="text-[#22c55e] text-7xl font-mono font-bold tracking-widest animate-bounce-in">
                                    {displayedNumber}
                                </span>
                            )}

                            {/* Input Field */}
                            {calcState === 'INPUT' && (
                                <form onSubmit={handleCalcSubmit} className="w-full h-full flex items-center justify-center">
                                    <input
                                        ref={inputRef}
                                        type="number"
                                        value={calcInput}
                                        onChange={(e) => setCalcInput(e.target.value)}
                                        onBlur={(e) => e.target.focus()} // Force focus back
                                        className="w-full h-full bg-transparent text-[#22c55e] text-7xl font-mono font-bold text-center focus:outline-none placeholder-green-900/20"
                                        placeholder="?"
                                        autoFocus
                                    />
                                </form>
                            )}

                            {/* Idle / Waiting State */}
                            {displayedNumber === null && calcState !== 'INPUT' && (
                                <div className="flex gap-2 opacity-20">
                                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse delay-150"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message / Feedback Area - Fixed Position below Number Display */}
                    <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[600px] h-24 flex items-start justify-center z-50">
                        {(calcState === 'SHOWING_RULE' || calcState === 'FEEDBACK') && (
                            <div className={`w-full text-center text-xl font-bold font-mono p-2 rounded bg-black/50 backdrop-blur-sm border border-white/20 animate-fade-in ${
                                calcState === 'FEEDBACK' 
                                    ? (calcFeedback?.isCorrect ? 'text-green-400 border-green-500/50' : 'text-red-400 border-red-500/50')
                                    : 'text-blue-400 border-blue-500/50'
                            }`}>
                                {calcState === 'SHOWING_RULE' && (
                                    <>
                                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">New Calculation Rule</div>
                                        <div className="animate-pulse">{getRuleText(currentRule)}</div>
                                    </>
                                )}
                                {calcState === 'FEEDBACK' && calcFeedback && (
                                    <div className="leading-tight whitespace-pre-wrap">
                                        {calcFeedback.message}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Hint Text Area - Fixed Position at bottom */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-max flex justify-center z-50">
                        <div className={`text-center transition-opacity duration-300 ${showHint ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="text-yellow-400 font-mono text-lg font-bold bg-black/60 px-6 py-3 rounded-lg backdrop-blur-sm shadow-xl border border-yellow-500/30 whitespace-nowrap">
                                {hintText}
                            </div>
                        </div>
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
