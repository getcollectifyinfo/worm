import { useState, useEffect, useRef, useCallback } from 'react';
import { SHAPES, COLORS, DIRECTIONS, INITIAL_SETTINGS, LEVELS } from './vigiConstants';

// Define types based on constants
type ShapeType = typeof SHAPES[number];
type ColorType = typeof COLORS[number];
type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS];
type Level = typeof LEVELS.EASY;
type Settings = typeof INITIAL_SETTINGS;

interface EventState {
  time: number;
  handled: boolean;
}

export const useGameLogic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('vigi_highscore') || '0'));
  const [gameTime, setGameTime] = useState(0); // seconds
  const [level, setLevel] = useState<Level>(LEVELS.EASY);

  // Statistics State
  const [totalEvents, setTotalEvents] = useState(0);
  const [caughtEvents, setCaughtEvents] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);

  // Game Object State
  const [position, setPosition] = useState(0); // 0-11
  const [shape, setShape] = useState<ShapeType>(SHAPES[0]);
  const [color, setColor] = useState<ColorType>(COLORS[0]);
  const [direction, setDirection] = useState<Direction>(DIRECTIONS.CLOCKWISE);
  
  // Event tracking for scoring
  // Store timestamp of last change for each type
  const lastEvents = useRef<Record<string, EventState>>({
    SHAPE: { time: 0, handled: false },
    COLOR: { time: 0, handled: false },
    TURN: { time: 0, handled: false },
    JUMP: { time: 0, handled: false },
  });

  // Settings
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  // Refs for loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loopRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setScore(0);
    setGameTime(0);
    setTotalEvents(0);
    setCaughtEvents(0);
    setLevel(LEVELS.EASY);
    setPosition(0);
    setShape(SHAPES[0]);
    setColor(COLORS[0]);
    setDirection(DIRECTIONS.CLOCKWISE);
    lastEvents.current = {
      SHAPE: { time: 0, handled: false },
      COLOR: { time: 0, handled: false },
      TURN: { time: 0, handled: false },
      JUMP: { time: 0, handled: false },
    };
  };

  const stopGame = () => {
    setIsPlaying(false);
    setIsPaused(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('vigi_highscore', score.toString());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (loopRef.current) clearTimeout(loopRef.current);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Timer for difficulty and game time
  useEffect(() => {
    if (isPlaying && !isPaused) {
      timerRef.current = setInterval(() => {
        setGameTime(prev => {
          const newTime = prev + 1;
          // Check Level
          if (newTime >= LEVELS.HARD.duration) setLevel(LEVELS.HARD);
          else if (newTime >= LEVELS.MEDIUM.duration) setLevel(LEVELS.MEDIUM);
          else setLevel(LEVELS.EASY);
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused]);

  // Refactoring tick to avoid closure staleness on state variables that aren't functional updates.
  // We use Refs for current state to avoid re-creating the tick function.

  const stateRef = useRef({ shape, color, direction, level, settings });
  useEffect(() => {
    stateRef.current = { shape, color, direction, level, settings };
  }, [shape, color, direction, level, settings]);

  const tickRef = useRef<(() => void) | null>(null);

  // State for cooldown tracking
  const cooldownRef = useRef(0); // timestamp until when no new events can happen

  const robustTick = useCallback(() => {
    if (!isPlaying || isPaused) return;

    const { shape, color, direction, level, settings } = stateRef.current;
    const now = Date.now();
    const nextDelay = settings.baseSpeed * level.speedMult;
    const changeChance = settings.changeFrequency * level.freqMult;

    let eventTriggered = false;

    // Only try to trigger event if cooldown has passed
    if (now > cooldownRef.current) {
      const rand = Math.random();
      
      // We will try one event type per tick based on probability slices
      if (rand < changeChance) {
        // Which event?
        const eventTypeRand = Math.random();
        
        // Equal probability for each event type for simplicity, or weighted
        if (eventTypeRand < 0.25) {
           // SHAPE
           const newShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
           if (newShape !== shape) {
             setShape(newShape);
             lastEvents.current.SHAPE = { time: now, handled: false };
             setTotalEvents(prev => prev + 1);
             eventTriggered = true;
           }
        } else if (eventTypeRand < 0.50) {
           // COLOR
           const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
           if (newColor !== color) {
             setColor(newColor);
             lastEvents.current.COLOR = { time: now, handled: false };
             setTotalEvents(prev => prev + 1);
             eventTriggered = true;
           }
        } else if (eventTypeRand < 0.75) {
           // TURN
           const newDir = (direction * -1) as Direction;
           setDirection(newDir);
           lastEvents.current.TURN = { time: now, handled: false };
           setTotalEvents(prev => prev + 1);
           eventTriggered = true;
        } else {
           // JUMP
           lastEvents.current.JUMP = { time: now, handled: false };
           setTotalEvents(prev => prev + 1);
           eventTriggered = true;
        }

        if (eventTriggered) {
          // Set cooldown to prevent another event for a few steps
          cooldownRef.current = now + 2000; 
        }
      }
    }

    // Movement Logic
    let steps = 1;
    if (lastEvents.current.JUMP.time === now) {
      steps = 3; // Jump 3 steps
    }

    setPosition(prev => {
      let effectiveDirection = direction;
      if (lastEvents.current.TURN.time === now) {
        effectiveDirection = (direction * -1) as Direction; // We know we flipped it
      }

      let nextPos = prev + (steps * effectiveDirection);
      if (nextPos >= 12) nextPos = nextPos % 12;
      if (nextPos < 0) nextPos = 12 + (nextPos % 12);
      return nextPos;
    });

    loopRef.current = setTimeout(() => tickRef.current?.(), nextDelay);
  }, [isPlaying, isPaused]); 

  useEffect(() => {
    tickRef.current = robustTick;
  }, [robustTick]);

  // Re-bind tick only when isPlaying changes
  useEffect(() => {
    if (isPlaying && !isPaused) {
      tickRef.current?.();
    }
    return () => {
        if (loopRef.current) clearTimeout(loopRef.current);
    };
  }, [isPlaying, isPaused]);


  const handleInteraction = (type: 'SHAPE' | 'COLOR' | 'TURN' | 'JUMP') => { 
    if (!isPlaying) return;

    const event = lastEvents.current[type];
    if (!event) return;

    const now = Date.now();
    const diff = now - event.time;

    if (event.handled) {
      // Already handled, count as wrong move (double press)
      setWrongMoves(prev => prev + 1);
      return;
    }

    if (diff <= settings.scoreWindows.excellent.time) {
      setScore(s => s + settings.scoreWindows.excellent.points);
      event.handled = true;
      setCaughtEvents(prev => prev + 1);
    } else if (diff <= settings.scoreWindows.good.time) {
      setScore(s => s + settings.scoreWindows.good.points);
      event.handled = true;
      setCaughtEvents(prev => prev + 1);
    } else {
      // Too late, or wrong click. 
      setWrongMoves(prev => prev + 1);
    }
  };

  return {
    gameState: { isPlaying, isPaused, score, highScore, gameTime, level, position, shape, color, direction, totalEvents, caughtEvents, wrongMoves },
    actions: { startGame, stopGame, togglePause, handleInteraction, setSettings },
    settings
  };
};
