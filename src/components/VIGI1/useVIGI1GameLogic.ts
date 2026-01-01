import { useState, useEffect, useCallback, useRef } from 'react';
import { statsService } from '../../services/statsService';

export const useVIGI1GameLogic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [analogValue, setAnalogValue] = useState(36); // 1-36
  const [digitalValue, setDigitalValue] = useState(360);
  const [gameTime, setGameTime] = useState(0);
  const [gameDuration, setGameDuration] = useState(60); // Default 60 seconds
  
  const [isPaused, setIsPaused] = useState(false);

  // Stats
  const [totalEvents, setTotalEvents] = useState(0); // Total mismatches presented
  const [caughtEvents, setCaughtEvents] = useState(0); // Correct clicks on mismatch
  const [wrongMoves, setWrongMoves] = useState(0); // Clicks on match (false alarm)
  
  // Audio Challenge Stats
  const [audioEvents, setAudioEvents] = useState(0); // Total audio targets (3 in a row)
  const [caughtAudio, setCaughtAudio] = useState(0); // Correctly identified
  const [wrongAudio, setWrongAudio] = useState(0); // False alarms
  const [audioDifficulty, setAudioDifficulty] = useState(5); // 1-10, controls repetition frequency

  // Refs for Settings (to access latest values in intervals)
  const gameDurationRef = useRef(gameDuration);
  const audioDifficultyRef = useRef(audioDifficulty);

  useEffect(() => {
    gameDurationRef.current = gameDuration;
  }, [gameDuration]);

  useEffect(() => {
    audioDifficultyRef.current = audioDifficulty;
  }, [audioDifficulty]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  
  const directionRef = useRef<1 | -1>(1); // 1: Clockwise, -1: Counter-clockwise
  const stepsUntilTurnRef = useRef<number>(0);

  // Audio Logic Refs
  const toneHistoryRef = useRef<string[]>([]);
  const isAudioTargetRef = useRef<boolean>(false); // True if currently in the window after 3rd same tone
  const audioTargetStartTimeRef = useRef<number>(0);
  const mismatchStartTimeRef = useRef<number>(0);
  const reactionTimesRef = useRef<number[]>([]);
  const [avgReactionTime, setAvgReactionTime] = useState(0);

  const canClickAudioRef = useRef<boolean>(true); // Prevent double clicking for same event

  // Sync refs for cleanup/save
  const statsRef = useRef({
    score, gameTime, totalEvents, caughtEvents, wrongMoves,
    audioEvents, caughtAudio, wrongAudio, audioDifficulty, avgReactionTime
  });
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    statsRef.current = {
      score, gameTime, totalEvents, caughtEvents, wrongMoves,
      audioEvents, caughtAudio, wrongAudio, audioDifficulty, avgReactionTime
    };
  }, [score, gameTime, totalEvents, caughtEvents, wrongMoves, audioEvents, caughtAudio, wrongAudio, audioDifficulty, avgReactionTime]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Difficulty settings (could be passed in)
  const UPDATE_SPEED = 1000; // ms per update
  const MISMATCH_CHANCE = 0.3; // 30% chance of mismatch
  const AUDIO_INTERVAL = 2000; // 1s play + 1s gap approx (or fixed interval)

  const TONES = useRef(['ince', 'orta', 'kalin']).current;

  const playRandomTone = useCallback(() => {
    // Reset target flag from previous turn if it wasn't caught
    if (isAudioTargetRef.current) {
        // If we were in a target state and it's time for next sound, user missed it.
        // We could count this as a miss if we wanted distinct 'miss' stats.
        isAudioTargetRef.current = false;
    }
    canClickAudioRef.current = true; // Reset clickability for next sound window

    let randomTone = TONES[Math.floor(Math.random() * TONES.length)];
    
    // Apply Audio Difficulty Bias
    // Difficulty 1-10. Higher difficulty -> Higher chance of repeating the last tone.
    // This naturally increases the probability of 3-in-a-row sequences.
    const history = toneHistoryRef.current;
    if (history.length > 0) {
        const lastTone = history[history.length - 1];
        // Calculate forced repeat chance: 0.0 (Diff 1) to ~0.45 (Diff 10)
        // Base 1/3 chance + Boost
        const forcedRepeatChance = (audioDifficultyRef.current - 1) * 0.05; 
        
        if (Math.random() < forcedRepeatChance) {
            randomTone = lastTone;
        }
    }

    const audio = new Audio(`/${randomTone}.m4a`);
    audio.play().catch(e => console.error("Audio play failed", e));

    // Update history
    history.push(randomTone);
    if (history.length > 3) history.shift(); // Keep last 3

    // Check for pattern
    if (history.length === 3) {
        if (history[0] === history[1] && history[1] === history[2]) {
            // TARGET!
            isAudioTargetRef.current = true;
            audioTargetStartTimeRef.current = Date.now();
            setAudioEvents(prev => prev + 1);
            // Clear history so we don't trigger again on 4th same tone (unless that's desired? 
            // User said "3 times same tone". 
            // If sequence is A A A A -> Is that two events? A A A (1) + A A A (2)?
            // Usually "3 in a row" means reset or sliding window. 
            // Let's assume sliding window: A A A -> event. Next is A. Now we have A A A again. 
            // But usually for these tests, it's distinct sets.
            // Let's keep it simple: Sliding window is standard for N-back, but this is "3 in a row".
            // If I clear history, A A A A becomes (A A A) -> cleared -> (A). User needs 2 more A's.
            // If I don't clear, A A A A triggers on index 3 and 4.
            // Let's clear to be safe and distinct.
            toneHistoryRef.current = []; 
        }
    }
  }, [TONES]);


  // Refactored State Update Logic to ensure synchronization
  const updateGameLoop = useCallback(() => {
    setAnalogValue(prevAnalog => {
        // 1. Logic for movement
        stepsUntilTurnRef.current--;
        if (stepsUntilTurnRef.current <= 0) {
            directionRef.current = Math.random() < 0.5 ? 1 : -1;
            stepsUntilTurnRef.current = Math.floor(Math.random() * 8) + 3;
        }

        let nextAnalog = prevAnalog + directionRef.current;
        if (nextAnalog > 36) nextAnalog = 1;
        if (nextAnalog < 1) nextAnalog = 36;

        // 2. Logic for Digital Display (Mismatch generation)
        const shouldMismatch = Math.random() < MISMATCH_CHANCE;
        let nextDigital = nextAnalog * 10;

        if (shouldMismatch) {
            // User example: "Needle 5->6, Digital 50 (previous)".
            // Let's implement this specific "Lag" type error often.
            const isLagError = Math.random() < 0.6; 
            
            if (isLagError) {
                // Show value for (nextAnalog - direction) -> effectively previous position
                let prevPos = nextAnalog - directionRef.current;
                if (prevPos > 36) prevPos = 1;
                if (prevPos < 1) prevPos = 36;
                nextDigital = prevPos * 10;
            } else {
                 // Random wrong number
                 const offset = Math.random() < 0.5 ? -10 : 10;
                 nextDigital += offset;
            }

            // Boundary checks for digital
            if (nextDigital < 0) nextDigital += 360; // loose wrapping
            
            // Avoid accidental match (rare but possible with wrapping logic)
            if (nextDigital === nextAnalog * 10) nextDigital += 10;

            setTotalEvents(prev => prev + 1);
            mismatchStartTimeRef.current = Date.now();
        }

        setDigitalValue(nextDigital);
        return nextAnalog;
    });
  }, []);

  const stopGame = useCallback(() => {
    // Check ref to see if we were playing (avoids saving if already stopped)
    if (isPlayingRef.current) {
        const s = statsRef.current;
        const totalOps = s.totalEvents + s.audioEvents;
        const caughtOps = s.caughtEvents + s.caughtAudio;
        
        statsService.saveSession({
            game_type: 'VIGI1',
            score: s.score,
            duration_seconds: s.gameTime,
            metadata: {
                totalEvents: s.totalEvents,
                caughtEvents: s.caughtEvents,
                wrongMoves: s.wrongMoves,
                audioEvents: s.audioEvents,
                caughtAudio: s.caughtAudio,
                wrongAudio: s.wrongAudio,
                audioDifficulty: s.audioDifficulty,
                missed_events: totalOps - caughtOps,
                accuracy: totalOps > 0 ? Math.round((caughtOps / totalOps) * 100) : 0,
                avg_speed_ms: Math.round(s.avgReactionTime)
            }
        }).catch(err => console.error("Failed to save VIGI1 stats:", err));
    }

    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsPaused(false); // Reset pause state
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
  }, []); // Empty dependency array = stable function

  const startIntervals = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);

    updateIntervalRef.current = setInterval(updateGameLoop, UPDATE_SPEED);
    audioIntervalRef.current = setInterval(playRandomTone, AUDIO_INTERVAL);

    // Timer
    timerRef.current = setInterval(() => {
      setGameTime(prev => {
        const nextTime = prev + 1;
        if (nextTime >= gameDurationRef.current) {
          stopGame();
        }
        return nextTime;
      });
    }, 1000);
  }, [updateGameLoop, playRandomTone, stopGame]); // Removed gameDuration from dependency to prevent restart

  const clearIntervals = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
  }, []);

  const pauseGame = useCallback(() => {
    if (!isPlaying || isPaused) return;
    setIsPaused(true);
    clearIntervals();
  }, [isPlaying, isPaused, clearIntervals]);

  const resumeGame = useCallback(() => {
    if (!isPlaying || !isPaused) return;
    setIsPaused(false);
    startIntervals();
  }, [isPlaying, isPaused, startIntervals]);

  const togglePause = useCallback(() => {
      if (isPaused) resumeGame();
      else pauseGame();
  }, [isPaused, resumeGame, pauseGame]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
    setGameTime(0);
    setTotalEvents(0);
    setCaughtEvents(0);
    setWrongMoves(0);
    reactionTimesRef.current = [];
    setAvgReactionTime(0);
    
    // Reset Audio Stats
    setAudioEvents(0);
    setCaughtAudio(0);
    setWrongAudio(0);
    toneHistoryRef.current = [];
    isAudioTargetRef.current = false;
    
    // Random start position
    const startPos = Math.floor(Math.random() * 36) + 1;
    setAnalogValue(startPos);
    setDigitalValue(startPos * 10);
    
    // Initialize movement
    directionRef.current = 1; 
    stepsUntilTurnRef.current = Math.floor(Math.random() * 5) + 3;

    // Game Loop
    startIntervals();
  }, [startIntervals]);

  const handleEyeClick = () => {
    if (!isPlaying || isPaused) return;

    const expectedDigital = analogValue * 10;
    const isMismatch = digitalValue !== expectedDigital;

    if (isMismatch) {
      // Correct detection!
      setScore(prev => prev + 10);
      setCaughtEvents(prev => prev + 1);
      
      const rt = Date.now() - mismatchStartTimeRef.current;
      reactionTimesRef.current.push(rt);
      setAvgReactionTime(
          reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
      );

      // Feedback?
    } else {
      // False alarm (It was a match, but user clicked)
      setScore(prev => Math.max(0, prev - 5));
      setWrongMoves(prev => prev + 1);
    }
  };

  const handleNoteClick = () => {
    if (!isPlaying || isPaused) return;
    
    if (!canClickAudioRef.current) return; // Prevent spamming in same window
    canClickAudioRef.current = false;

    if (isAudioTargetRef.current) {
        // Success!
        setScore(prev => prev + 10);
        setCaughtAudio(prev => prev + 1);
        isAudioTargetRef.current = false; // Consumed

        const rt = Date.now() - audioTargetStartTimeRef.current;
        reactionTimesRef.current.push(rt);
        setAvgReactionTime(
            reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
        );

    } else {
        // Fail
        setScore(prev => Math.max(0, prev - 5));
        setWrongAudio(prev => prev + 1);
    }
  };

  // Wrappers for immediate ref updates
  const setGameDurationImmediate = useCallback((val: number) => {
    setGameDuration(val);
    gameDurationRef.current = val;
  }, []);

  const setAudioDifficultyImmediate = useCallback((val: number) => {
    setAudioDifficulty(val);
    audioDifficultyRef.current = val;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopGame();
    };
  }, [stopGame]);

  return {
    gameState: {
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
    },
    actions: {
      startGame,
      stopGame,
      pauseGame,
      resumeGame,
      togglePause,
      handleEyeClick,
      handleNoteClick,
      setGameDuration: setGameDurationImmediate,
      setAudioDifficulty: setAudioDifficultyImmediate
    }
  };
};
