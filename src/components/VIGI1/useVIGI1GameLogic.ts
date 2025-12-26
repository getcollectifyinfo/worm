import { useState, useEffect, useCallback, useRef } from 'react';

export const useVIGI1GameLogic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [analogValue, setAnalogValue] = useState(36); // 1-36
  const [digitalValue, setDigitalValue] = useState(360);
  const [gameTime, setGameTime] = useState(0);
  const [gameDuration, setGameDuration] = useState(60); // Default 60 seconds
  
  // Stats
  const [totalEvents, setTotalEvents] = useState(0); // Total mismatches presented
  const [caughtEvents, setCaughtEvents] = useState(0); // Correct clicks on mismatch
  const [wrongMoves, setWrongMoves] = useState(0); // Clicks on match (false alarm)
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const directionRef = useRef<1 | -1>(1); // 1: Clockwise, -1: Counter-clockwise
  const stepsUntilTurnRef = useRef<number>(0);

  // Difficulty settings (could be passed in)
  const UPDATE_SPEED = 1000; // ms per update
  const MISMATCH_CHANCE = 0.3; // 30% chance of mismatch

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
        }

        setDigitalValue(nextDigital);
        return nextAnalog;
    });
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setGameTime(0);
    setTotalEvents(0);
    setCaughtEvents(0);
    setWrongMoves(0);
    
    // Random start position
    const startPos = Math.floor(Math.random() * 36) + 1;
    setAnalogValue(startPos);
    setDigitalValue(startPos * 10);
    
    // Initialize movement
    directionRef.current = 1; 
    stepsUntilTurnRef.current = Math.floor(Math.random() * 5) + 3;

    // Game Loop
    updateIntervalRef.current = setInterval(updateGameLoop, UPDATE_SPEED);

    // Timer
    timerRef.current = setInterval(() => {
      setGameTime(prev => {
        const nextTime = prev + 1;
        if (nextTime >= gameDuration) {
          stopGame();
        }
        return nextTime;
      });
    }, 1000);
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
  };

  const handleEyeClick = () => {
    if (!isPlaying) return;

    const expectedDigital = analogValue * 10;
    const isMismatch = digitalValue !== expectedDigital;

    if (isMismatch) {
      // Correct detection!
      setScore(prev => prev + 10);
      setCaughtEvents(prev => prev + 1);
      // Feedback?
    } else {
      // False alarm (It was a match, but user clicked)
      setScore(prev => Math.max(0, prev - 5));
      setWrongMoves(prev => prev + 1);
    }
    
    // Optional: Immediately trigger next state or wait? 
    // Usually vigilance tests just continue.
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopGame();
    };
  }, []);

  return {
    gameState: {
      isPlaying,
      score,
      gameTime,
      gameDuration,
      analogValue,
      digitalValue,
      totalEvents,
      caughtEvents,
      wrongMoves
    },
    actions: {
      startGame,
      stopGame,
      handleEyeClick,
      setGameDuration
    }
  };
};
