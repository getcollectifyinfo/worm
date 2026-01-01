import { useState, useEffect, useCallback } from 'react';

export type CubePosition = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | 'FRONT' | 'BACK';
export type CubeLabel = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | 'FRONT' | 'BACK';
export type Command = 'LEFT' | 'RIGHT' | 'FRONT' | 'BACK';

export interface CubeState {
  TOP: CubeLabel;
  BOTTOM: CubeLabel;
  LEFT: CubeLabel;
  RIGHT: CubeLabel;
  FRONT: CubeLabel;
  BACK: CubeLabel;
}

export const INITIAL_CUBE_STATE: CubeState = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  FRONT: 'FRONT',
  BACK: 'BACK',
};

type GamePhase = 'IDLE' | 'SHOWING_TARGET' | 'SHOWING_COMMANDS' | 'WAITING_ANSWER' | 'FEEDBACK';

export const TARGET_DISPLAY_DURATION = 2000; // ms

// Helper functions
const generateCommands = (count: number): Command[] => {
  const cmds: Command[] = [];
  const allOptions: Command[] = ['LEFT', 'RIGHT', 'FRONT', 'BACK'];
  
  let lastCmd: Command | null = null;
  
  for (let i = 0; i < count; i++) {
    let availableOptions: Command[];
    
    if (lastCmd) {
      availableOptions = allOptions.filter((cmd) => cmd !== lastCmd);
    } else {
      availableOptions = allOptions;
    }
      
    const nextCmd = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    cmds.push(nextCmd);
    lastCmd = nextCmd;
  }
  return cmds;
};

const applyCommand = (state: CubeState, cmd: Command): CubeState => {
  const newState = { ...state };
  
  switch (cmd) {
    case 'LEFT':
      // A) Komut LEFT (küp “sola roll” eder, Front/Back sabit kalır):
      // yeniTop = state.Right
      // yeniRight = state.Bottom
      // yeniBottom = state.Left
      // yeniLeft = state.Top
      newState.TOP = state.RIGHT;
      newState.RIGHT = state.BOTTOM;
      newState.BOTTOM = state.LEFT;
      newState.LEFT = state.TOP;
      break;
      
    case 'RIGHT':
      // B) Komut RIGHT (küp “sağa roll” eder, Front/Back sabit):
      // yeniTop = state.Left
      // yeniLeft = state.Bottom
      // yeniBottom = state.Right
      // yeniRight = state.Top
      newState.TOP = state.LEFT;
      newState.LEFT = state.BOTTOM;
      newState.BOTTOM = state.RIGHT;
      newState.RIGHT = state.TOP;
      break;
      
    case 'FRONT':
      // C) Komut FRONT (küp “kendine doğru devrilir”):
      // yeniFront = state.Top
      // yeniTop = state.Back
      // yeniBack = state.Bottom
      // yeniBottom = state.Front
      newState.FRONT = state.TOP;
      newState.TOP = state.BACK;
      newState.BACK = state.BOTTOM;
      newState.BOTTOM = state.FRONT;
      break;
      
    case 'BACK':
      // D) Komut BACK (küp “arkaya doğru devrilir”):
      // yeniFront = state.Bottom
      // yeniBottom = state.Back
      // yeniBack = state.Top
      // yeniTop = state.Front
      newState.FRONT = state.BOTTOM;
      newState.BOTTOM = state.BACK;
      newState.BACK = state.TOP;
      newState.TOP = state.FRONT;
      break;
  }
  
  return newState;
};

const calculateFinalState = (startState: CubeState, cmds: Command[]): CubeState => {
  let currentState = { ...startState };
  for (const cmd of cmds) {
    currentState = applyCommand(currentState, cmd);
  }
  return currentState;
};

const findPositionOfLabel = (state: CubeState, label: CubeLabel): CubePosition => {
  if (state.TOP === label) return 'TOP';
  if (state.BOTTOM === label) return 'BOTTOM';
  if (state.LEFT === label) return 'LEFT';
  if (state.RIGHT === label) return 'RIGHT';
  if (state.FRONT === label) return 'FRONT';
  if (state.BACK === label) return 'BACK';
  return 'TOP'; // Should not happen
};

export const useCubeGameLogic = () => {
  const [phase, setPhase] = useState<GamePhase>('IDLE');
  const [targetLabel, setTargetLabel] = useState<CubeLabel>('RIGHT');
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(-1);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState<CubePosition>('RIGHT');
  const [userAnswer, setUserAnswer] = useState<CubePosition | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [waitingStartTime, setWaitingStartTime] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  
  // Settings
  const [commandSpeed, setCommandSpeed] = useState(1500);
  const [commandCount, setCommandCount] = useState(5);
  
  // Derived state
  const currentCommand = (phase === 'SHOWING_COMMANDS' && currentCommandIndex >= 0 && currentCommandIndex < commands.length)
    ? commands[currentCommandIndex]
    : null;
  
  const startRound = useCallback(() => {
    // 1. Select target
    const labels: CubeLabel[] = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT', 'FRONT', 'BACK'];
    const newTarget = labels[Math.floor(Math.random() * labels.length)];
    setTargetLabel(newTarget);

    // 2. Generate commands
    const newCommands = generateCommands(commandCount);
    setCommands(newCommands);

    // 3. Calculate result
    const resultState = calculateFinalState(INITIAL_CUBE_STATE, newCommands);
    const correctPos = findPositionOfLabel(resultState, newTarget);
    setCorrectAnswer(correctPos);

    // 4. Start flow
    setPhase('SHOWING_TARGET');
    setUserAnswer(null);
    setCurrentCommandIndex(-1);

    // Transition to commands after delay
    setTimeout(() => {
      setPhase('SHOWING_COMMANDS');
      setCurrentCommandIndex(0);
    }, TARGET_DISPLAY_DURATION);

  }, [commandCount]);

  const startGame = useCallback(() => {
    setScore(0);
    setRound(1);
    setCorrectCount(0);
    setWrongCount(0);
    setReactionTimes([]);
    startRound();
  }, [startRound]);

  // Command animation loop
  useEffect(() => {
    if (phase === 'SHOWING_COMMANDS') {
      if (currentCommandIndex >= 0 && currentCommandIndex < commands.length) {
        const timer = setTimeout(() => {
          // Check if this was the last command
          if (currentCommandIndex + 1 >= commands.length) {
             setPhase('WAITING_ANSWER');
             setWaitingStartTime(Date.now());
          } else {
             setCurrentCommandIndex(prev => prev + 1);
          }
        }, commandSpeed);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, currentCommandIndex, commands, commandSpeed]);

  const handleAnswer = (position: CubePosition) => {
    if (phase !== 'WAITING_ANSWER') return;
    
    if (waitingStartTime) {
        const timeTaken = Date.now() - waitingStartTime;
        setReactionTimes(prev => [...prev, timeTaken]);
    }

    setUserAnswer(position);
    if (position === correctAnswer) {
      setScore(s => s + 10);
      setCorrectCount(c => c + 1);
    } else {
      setWrongCount(w => w + 1);
    }
    setPhase('FEEDBACK');
  };

  const avgReactionTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
    : 0;

  const nextRound = () => {
    setRound(r => r + 1);
    startRound();
  };

  return {
    phase,
    targetLabel,
    currentCommand,
    commands,
    currentCommandIndex,
    userAnswer,
    correctAnswer,
    score,
    round,
    correctCount,
    wrongCount,
    avgReactionTime,
    commandSpeed,
    commandCount,
    setCommandSpeed,
    setCommandCount,
    startGame,
    handleAnswer,
    nextRound
  };
};
