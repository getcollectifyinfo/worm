import { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { LogPanel } from './components/LogPanel';
import { MissionPanel } from './components/MissionPanel';
import { IPPGame } from './components/IPPGame';
import VIGIGame from './components/VIGI/VIGIGame';
import VIGI1Game from './components/VIGI1/VIGI1Game';
import CapacityGame from './components/Capacity/CapacityGame';
import { CubeGame } from './components/CubeRotation/CubeGame';
import { GameStartMenu } from './components/GameStartMenu';
import { GameTutorial } from './components/GameTutorial';
import { GRID_SIZE, DIFFICULTY_SETTINGS } from './types';
import type { Position, LogEntry, MissionStep, GameMode, ExamState, ExamOption, DifficultyLevel, Page } from './types';

const MOTIVATIONAL_MESSAGES = [
  "UMAY, YOU ARE GREAT!",
  "UMAY, I'M PROUD OF YOU!",
  "UMAY IS THE BEST!",
  "SUPER UMAY!",
  "BRAVO UMAY!",
  "UMAY, YOU ROCK!",
  "AMAZING UMAY!"
];

import { LandingPage } from './components/LandingPage';
import { MarketingPage } from './components/MarketingPage';
import { StatisticsPage } from './components/StatisticsPage';
import { SkytestPage } from './components/SkytestPage';
import { SkytestBlogPage } from './components/SkytestBlogPage';
import { SkytestPegasusBlogPage } from './components/SkytestPegasusBlogPage';
import { SkytestPreparationBlogPage } from './components/SkytestPreparationBlogPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { LegalDisclaimerPage } from './components/LegalDisclaimerPage';
import { SmartLoginGate } from './components/Auth/SmartLoginGate';
import { useAuth } from './hooks/useAuth';
import { useGameAccess } from './hooks/useGameAccess';
import { Loader2, Gamepad2, Lock } from 'lucide-react';
import { ProAccessModal } from './components/ProAccessModal';
import { GameSettingsModal, SettingsSection, SettingsLabel, SettingsRange } from './components/GameSettingsModal';

import { statsService } from './services/statsService';

import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading, signOut, refreshSession } = useAuth();
  const { 
    tier, 
    maxDuration, 
    openProModal, 
    closeProModal,
    showProModal,
    checkAccess,
    handleUpgrade,
    showLoginGate,
    closeLoginGate
  } = useGameAccess();
  const [proModalVariant, setProModalVariant] = useState<'default' | 'exam-settings'>('default');
  const [startTime, setStartTime] = useState<number>(0);
  // Navigation State
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Check for success/canceled params from Stripe
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        // Clear the query param to keep URL clean
        window.history.replaceState({}, '', window.location.pathname);
        return 'LANDING';
      }
    }

    // Simple URL check for initial state
    if (typeof window !== 'undefined' && window.location.pathname === '/skytest-nedir') {
      return 'SKYTEST_BLOG_1';
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/skytest') {
      return 'SKYTEST_PRODUCT';
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/skytest-pegasus') {
      return 'SKYTEST_PEGASUS_BLOG';
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/skytest-hazirlik') {
      return 'SKYTEST_PREPARATION_BLOG';
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/privacy') {
      return 'PRIVACY_POLICY';
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/terms') {
      return 'TERMS_OF_SERVICE';
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/simulation') {
      return 'LANDING';
    }
    return 'MARKETING';
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Handle Stripe Success Return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' && refreshSession) {
      // Force refresh session to get new subscription status
      refreshSession().then(() => {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-xl z-[200] animate-in slide-in-from-top-4 duration-300 font-medium flex items-center gap-2';
        toast.innerHTML = '<span>🎉 Tebrikler! Pro üyelik aktif edildi.</span>';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      });
    }
  }, [refreshSession]);

  // Handle pending pro upgrade after login
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
        const pending = localStorage.getItem('pending_pro_upgrade');
        if (pending) {
            localStorage.removeItem('pending_pro_upgrade');
            // Show toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl z-[200] animate-in slide-in-from-top-4 duration-300 font-medium flex items-center gap-2';
            toast.innerHTML = '<span>Hesap oluşturuldu. Pro üyeliğini tamamlayalım.</span>';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
            
            // Trigger upgrade logic with a small delay to ensure state is stable
            setTimeout(() => {
                handleUpgrade();
            }, 500);
        }
    }
  }, [user, handleUpgrade]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/skytest-nedir') {
        setCurrentPage('SKYTEST_BLOG_1');
      } else if (window.location.pathname === '/skytest-pegasus') {
        setCurrentPage('SKYTEST_PEGASUS_BLOG');
      } else if (window.location.pathname === '/skytest-hazirlik') {
        setCurrentPage('SKYTEST_PREPARATION_BLOG');
      } else if (window.location.pathname === '/privacy') {
        setCurrentPage('PRIVACY_POLICY');
      } else if (window.location.pathname === '/terms') {
        setCurrentPage('TERMS_OF_SERVICE');
      } else if (window.location.pathname === '/simulation') {
        setCurrentPage('LANDING');
      } else if (window.location.pathname === '/yasal-uyari') {
        setCurrentPage('LEGAL_DISCLAIMER');
      } else if (window.location.pathname === '/') {
        setCurrentPage('MARKETING');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when page changes (for internal navigation)
  useEffect(() => {
    if (currentPage === 'SKYTEST_BLOG_1' && window.location.pathname !== '/skytest-nedir') {
      window.history.pushState(null, '', '/skytest-nedir');
    } else if (currentPage === 'SKYTEST_PRODUCT' && window.location.pathname !== '/skytest') {
      window.history.pushState(null, '', '/skytest');
    } else if (currentPage === 'SKYTEST_PEGASUS_BLOG' && window.location.pathname !== '/skytest-pegasus') {
      window.history.pushState(null, '', '/skytest-pegasus');
    } else if (currentPage === 'SKYTEST_PREPARATION_BLOG' && window.location.pathname !== '/skytest-hazirlik') {
      window.history.pushState(null, '', '/skytest-hazirlik');
    } else if (currentPage === 'PRIVACY_POLICY' && window.location.pathname !== '/privacy') {
      window.history.pushState(null, '', '/privacy');
    } else if (currentPage === 'TERMS_OF_SERVICE' && window.location.pathname !== '/terms') {
      window.history.pushState(null, '', '/terms');
    } else if (currentPage === 'LANDING' && window.location.pathname !== '/simulation') {
      window.history.pushState(null, '', '/simulation');
    } else if (currentPage === 'MARKETING' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    // For other pages, we might want to stay on root or have specific URLs, but for now only handling these two explicitly asked ones.
  }, [currentPage]);

  // Reset game started when page changes
  useEffect(() => {
    setIsGameStarted(false);
    setIsTutorialOpen(false);
  }, [currentPage]);

  // Handle pending game redirect after login
  useEffect(() => {
    if (user && !loading) {
      const pendingGame = localStorage.getItem('pending_game');
      if (pendingGame) {
        localStorage.removeItem('pending_game');
        setCurrentPage(pendingGame as Page);
      }
    }
  }, [user, loading]);

  // Demo Timer for GUEST
  useEffect(() => {
    if (isGameStarted && maxDuration > 0 && currentPage === 'WORM') {
      const timer = setTimeout(() => {
        setIsGameStarted(false);
        setProModalVariant('default');
        openProModal();
      }, maxDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isGameStarted, maxDuration, currentPage, openProModal]);

  // Enforce EASY difficulty for Guests
  useEffect(() => {
    if (tier === 'GUEST') {
        setDifficulty('EASY');
    }
  }, [tier]);

  // Global State
  const [gameMode, setGameMode] = useState<GameMode>('PRACTISE');
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [instructionSpeed, setInstructionSpeed] = useState(1000); // ms
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [totalQuestions, setTotalQuestions] = useState(5);

  // Exam Session State
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [resultMessage, setResultMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0); // For rotating messages deterministically

  // Practise Mode State
  const [position, setPosition] = useState<Position>(() => {
    const startX = Math.floor(Math.random() * GRID_SIZE);
    const startY = Math.floor(Math.random() * GRID_SIZE);
    return { x: startX, y: startY };
  });
  const [rotation, setRotation] = useState<number>(() => Math.floor(Math.random() * 4) * 90);
  const [targetPosition, setTargetPosition] = useState<Position | undefined>(undefined);
  const [missionInstructions, setMissionInstructions] = useState<MissionStep[]>([]);
  
  // Mission Progress State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0); // For multi-key steps (e.g. Turn + Move)
  const [isError, setIsError] = useState(false);

  // Exam Mode State
  const [examState, setExamState] = useState<ExamState>('IDLE');
  const [examInstructions, setExamInstructions] = useState<MissionStep[]>([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [examOptions, setExamOptions] = useState<ExamOption[]>([]);
  const [examResult, setExamResult] = useState<'CORRECT' | 'FALSE' | null>(null);

  // UI State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleLoginClose = () => {
    closeLoginGate();
  };

  const handleLoginSuccess = () => {
    closeLoginGate();
    setIsSettingsOpen(true); // Open settings after login for Practice Mode flow
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
    if (gameMode === 'PRACTISE') {
        setTimeout(() => {
            startPractiseMission(position, rotation);
        }, 0);
    }
  };

  // Helper to get normalized rotation (0, 90, 180, 270)
  const getNormalizedRotation = useCallback((rot: number) => ((rot % 360) + 360) % 360, []);

  // BFS to find shortest path instructions
  const findShortestPath = useCallback((startPos: Position, startRot: number, targetPos: Position): MissionStep[] | null => {
    // Queue stores: { x, y, rot, instructions }
    // Visited stores: "x,y,normalizedRot"
    const queue = [{
      x: startPos.x,
      y: startPos.y,
      rot: startRot,
      instructions: [] as MissionStep[]
    }];
    
    const visited = new Set<string>();
    visited.add(`${startPos.x},${startPos.y},${getNormalizedRotation(startRot)}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Check if reached target
      if (current.x === targetPos.x && current.y === targetPos.y) {
        return current.instructions;
      }

      // Possible moves:
      // 1. Move Forward ("GO AHEAD") -> [' ']
      // 2. Turn Left + Move Forward ("TURN TO THE LEFT AND GO AHEAD") -> ['ArrowLeft', ' ']
      // 3. Turn Right + Move Forward ("TURN TO THE RIGHT AND GO AHEAD") -> ['ArrowRight', ' ']
      // 4. Turn Back + Move Forward ("TURN BACK AND GO AHEAD") -> ['ArrowDown', ' ']

      const moves = [
        { rotOffset: 0, label: "GO AHEAD", actions: [' '] },
        { rotOffset: -90, label: "TURN TO THE LEFT AND GO AHEAD", actions: ['ArrowLeft', ' '] },
        { rotOffset: 90, label: "TURN TO THE RIGHT AND GO AHEAD", actions: ['ArrowRight', ' '] },
        { rotOffset: 180, label: "TURN BACK AND GO AHEAD", actions: ['ArrowDown', ' '] }
      ];

      for (const move of moves) {
        const nextRot = current.rot + move.rotOffset;
        const nextNormRot = getNormalizedRotation(nextRot);
        
        let dx = 0;
        let dy = 0;
        if (nextNormRot === 0) dy = -1; // UP
        else if (nextNormRot === 90) dx = 1; // RIGHT
        else if (nextNormRot === 180) dy = 1; // DOWN
        else if (nextNormRot === 270) dx = -1; // LEFT

        const nextX = current.x + dx;
        const nextY = current.y + dy;

        // Check bounds
        if (nextX >= 0 && nextX < GRID_SIZE && nextY >= 0 && nextY < GRID_SIZE) {
          const stateKey = `${nextX},${nextY},${nextNormRot}`;
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            
            const newStep: MissionStep = {
                id: Math.random().toString(36).slice(2, 11),
                text: move.label,
                actions: move.actions
            };

            queue.push({
              x: nextX,
              y: nextY,
              rot: nextRot,
              instructions: [...current.instructions, newStep]
            });
          }
        }
      }
    }
    return null; // No path found
  }, [getNormalizedRotation]);

  // Generate a mission using Smart Target Search (Flood Fill)
  const generateMission = useCallback((startPos: Position, startRot: number): { target: Position, instructions: MissionStep[] } | null => {
    const { min, max } = DIFFICULTY_SETTINGS[difficulty];

    // Minimum required turns based on difficulty
    let minTurns = 0;
    if (difficulty === 'MEDIUM') minTurns = 2;
    else if (difficulty === 'HARD') minTurns = 3;
    else if (difficulty === 'EXPERT') minTurns = 3; // 4 might be too rare on 8x8

    // 1. Flood Fill BFS to find shortest paths to ALL cells
    // State: x, y, rot
    const dist = new Map<string, number>(); // "x,y,rot" -> steps
    const paths = new Map<string, MissionStep[]>(); // "x,y,rot" -> instructions
    
    const queue = [{
      x: startPos.x,
      y: startPos.y,
      rot: startRot,
      instructions: [] as MissionStep[]
    }];

    const startKey = `${startPos.x},${startPos.y},${getNormalizedRotation(startRot)}`;
    dist.set(startKey, 0);
    paths.set(startKey, []);

    // We store completed paths to targets
    const validCandidates: { target: Position, instructions: MissionStep[], turns: number }[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const { x, y, rot, instructions } = current;
      const currentSteps = instructions.length;

      // Optimization: Don't explore paths longer than max + 2 (buffer)
      if (currentSteps > max + 2) continue;

      // Check if this cell (at any rotation) is a valid target candidate
      // We only consider the "first time" we reach a cell with a valid path length?
      // Actually, since BFS guarantees shortest path to (x,y,rot), we check if this specific state is a valid end state.
      // But for the snake, reaching (x,y) with ANY rotation counts as reaching the target.
      // However, we want the SHORTEST path to (x,y).
      // So we should track if we've found a "best path" to (x,y) yet.
      // But wait, reaching (x,y) facing North vs East might have different costs.
      // We process all states. When collecting candidates, we'll pick the best one for each cell.

      // Store candidate if within length range
      if (currentSteps >= min && currentSteps <= max && (x !== startPos.x || y !== startPos.y)) {
          // Analyze turns
          let turns = 0;
          instructions.forEach(step => {
              if (step.text.includes("TURN")) turns++;
          });

          // Filter by difficulty constraints
          if (turns >= minTurns) {
              validCandidates.push({
                  target: { x, y },
                  instructions,
                  turns
              });
          }
      }

      // Explore neighbors
      const moves = [
        { rotOffset: 0, label: "GO AHEAD", actions: [' '] },
        { rotOffset: -90, label: "TURN TO THE LEFT AND GO AHEAD", actions: ['ArrowLeft', ' '] },
        { rotOffset: 90, label: "TURN TO THE RIGHT AND GO AHEAD", actions: ['ArrowRight', ' '] },
        { rotOffset: 180, label: "TURN BACK AND GO AHEAD", actions: ['ArrowDown', ' '] }
      ];

      for (const move of moves) {
        const nextRot = rot + move.rotOffset;
        const nextNormRot = getNormalizedRotation(nextRot);
        
        let dx = 0;
        let dy = 0;
        if (nextNormRot === 0) dy = -1;
        else if (nextNormRot === 90) dx = 1;
        else if (nextNormRot === 180) dy = 1;
        else if (nextNormRot === 270) dx = -1;

        const nextX = x + dx;
        const nextY = y + dy;

        if (nextX >= 0 && nextX < GRID_SIZE && nextY >= 0 && nextY < GRID_SIZE) {
          const nextKey = `${nextX},${nextY},${nextNormRot}`;
          const newCost = currentSteps + 1;

          if (!dist.has(nextKey) || newCost < dist.get(nextKey)!) {
            dist.set(nextKey, newCost);
            const newStep: MissionStep = {
                id: Math.random().toString(36).substr(2, 9),
                text: move.label,
                actions: move.actions
            };
            const newInstructions = [...instructions, newStep];
            paths.set(nextKey, newInstructions);
            
            queue.push({
              x: nextX,
              y: nextY,
              rot: nextRot,
              instructions: newInstructions
            });
          }
        }
      }
    }

    // 2. Selection Strategy
    // validCandidates contains all valid paths to all reachable states.
    // We want to pick a Target. A target might be reached in multiple ways (rotations).
    // But since BFS guarantees shortest path to (x,y,rot), and we filtered by length/turns...
    // We should group by unique Target(x,y) and pick the "best" path for that target?
    // Actually, usually the shortest path to (x,y) is unique in length.
    // If there are multiple valid paths to (x,y) (different final rotations), they are all valid "solutions".
    // We can just pick a random valid candidate.
    
    // However, we want to prioritize "Harder" paths if possible (more turns).
    // Sort candidates by turns (descending) then length (descending)?
    
    if (validCandidates.length > 0) {
        // Filter candidates to ensure we don't just pick the first one.
        // Group by Target to avoid bias towards targets with multiple valid approach angles?
        // Actually, let's just score them.
        
        // Score = turns * 2 + length
        const scored = validCandidates.map(c => ({
            ...c,
            score: c.turns * 2 + c.instructions.length
        }));
        
        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);
        
        // Take top 20% or top 10 to randomize
        const topCount = Math.max(1, Math.min(10, Math.floor(scored.length * 0.3)));
        const topCandidates = scored.slice(0, topCount);
        
        const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];
        return { target: selected.target, instructions: selected.instructions };
    }

    // Fallback: If no strict candidate found (e.g. Expert mode on small grid might be hard),
    // relax turn constraints.
    console.warn("No strict candidate found, relaxing turn constraints...");
    
    // Retry with relaxed constraint (minTurns - 1)
    if (minTurns > 0) {
         // Re-scan? No, we didn't store invalid ones.
         // We need to re-run or modify the loop logic. 
         // Better: Collect ALL valid length candidates in the loop, then filter/sort at the end.
         return null; // Let the wrapper handle retry or just return simple path?
    }
    
    return null;
  }, [difficulty, getNormalizedRotation]);

  // Wrapper to handle fallbacks
  const getMission = useCallback((startPos: Position, startRot: number) => {
      // Try generate with current difficulty
      const result = generateMission(startPos, startRot);
      
      // If failed (too strict), try one level lower? 
      // Or just find ANY path of correct length (ignore turns)
      if (!result) {
          // Simple search (Length only)
          const { min, max } = DIFFICULTY_SETTINGS[difficulty];
          for (let i=0; i<100; i++) {
              const tx = Math.floor(Math.random() * GRID_SIZE);
              const ty = Math.floor(Math.random() * GRID_SIZE);
              if (tx === startPos.x && ty === startPos.y) continue;
              const path = findShortestPath(startPos, startRot, {x: tx, y: ty});
              if (path && path.length >= min && path.length <= max) {
                  return { target: {x: tx, y: ty}, instructions: path };
              }
          }
      }
      return result;
  }, [generateMission, findShortestPath, difficulty]);

  // Start Practise Mission
  const startPractiseMission = useCallback((startPos: Position, startRot: number) => {
     const result = getMission(startPos, startRot);
     if (result) {
         setTargetPosition(result.target);
         setMissionInstructions(result.instructions);
         setCurrentStepIndex(0);
         setCurrentSubStepIndex(0);
         setLogs(prev => [
            { id: Date.now().toString(), message: `New Mission: ${DIFFICULTY_SETTINGS[difficulty].label}`, timestamp: Date.now() },
            ...prev
         ]);
         setIsError(false);
     }
  }, [getMission, difficulty]);

  // Start Exam Mode (Generate Question)
  const startExam = useCallback(() => {
    setGameMode('EXAM');
    setExamState('SHOWING_INSTRUCTIONS');
    setExamResult(null);
    setCurrentInstructionIndex(0);
    
    // 1. Generate Correct Scenario
    const startX = Math.floor(Math.random() * GRID_SIZE);
    const startY = Math.floor(Math.random() * GRID_SIZE);
    const startRot = Math.floor(Math.random() * 4) * 90;
    const startPos = { x: startX, y: startY };
    
    const correctMission = getMission(startPos, startRot);
    
    if (!correctMission) {
        console.error("Failed to generate exam mission");
        return;
    }

    setExamInstructions(correctMission.instructions);

    // 2. Generate Options (1 Correct + 3 Distractors)
    const options: ExamOption[] = [];
    
    // Add Correct Option
    options.push({
        id: 'correct',
        snakePosition: startPos,
        snakeRotation: startRot,
        targetPosition: correctMission.target,
        isCorrect: true
    });

    // Add Distractors
    while (options.length < 4) {
        const dX = Math.floor(Math.random() * GRID_SIZE);
        const dY = Math.floor(Math.random() * GRID_SIZE);
        const dRot = Math.floor(Math.random() * 4) * 90;
        const dTargetX = Math.floor(Math.random() * GRID_SIZE);
        const dTargetY = Math.floor(Math.random() * GRID_SIZE);

        // Simple check to ensure it's not identical to correct one (though path validity is what matters)
        // For distractors, we just want random configurations that likely DON'T match the instructions.
        // In a real exam, we might want "near misses", but random is good for now.
        
        // Ensure unique ID
        options.push({
            id: `distractor-${options.length}`,
            snakePosition: { x: dX, y: dY },
            snakeRotation: dRot,
            targetPosition: { x: dTargetX, y: dTargetY },
            isCorrect: false
        });
    }

    // Shuffle Options
    setExamOptions(options.sort(() => Math.random() - 0.5));

  }, [getMission]);

  // Exam Timer for Instructions
  useEffect(() => {
    if (gameMode === 'EXAM') {
        if (examState === 'SHOWING_INSTRUCTIONS') {
            const timer = setTimeout(() => {
                setExamState('WAITING_BETWEEN_INSTRUCTIONS');
            }, instructionSpeed); // Show instruction for configured time
            return () => clearTimeout(timer);
        } else if (examState === 'WAITING_BETWEEN_INSTRUCTIONS') {
            const timer = setTimeout(() => {
                setCurrentInstructionIndex(prev => {
                    if (prev + 1 >= examInstructions.length) {
                        setExamState('SELECTION');
                        return prev;
                    }
                    setExamState('SHOWING_INSTRUCTIONS');
                    return prev + 1;
                });
            }, 500); // 500ms gap
            return () => clearTimeout(timer);
        }
    }
  }, [gameMode, examState, examInstructions, instructionSpeed]);

  // Initialize Game
  useEffect(() => {
      // For now, let's start a mission on mount if practise
      // Use setTimeout to avoid synchronous state update warning during render phase (though useEffect runs after render)
      // The warning is about cascading updates.
      if (isGameStarted && gameMode === 'PRACTISE' && !targetPosition) {
           const timer = setTimeout(() => startPractiseMission(position, rotation), 0);
           return () => clearTimeout(timer);
      }
  }, [isGameStarted, gameMode, targetPosition, startPractiseMission, position, rotation]);

  // Start New Exam Session
  const startExamSession = useCallback(() => {
      setCorrectAnswersCount(0);
      setCurrentQuestionNumber(1);
      setStartTime(Date.now());
      startExam();
  }, [startExam]);

  const handleOptionSelect = (option: ExamOption) => {
      const isCorrect = option.isCorrect;
      setExamResult(isCorrect ? 'CORRECT' : 'FALSE');
      
      if (isCorrect) {
          setCorrectAnswersCount(prev => prev + 1);
          setResultMessage(MOTIVATIONAL_MESSAGES[messageIndex % MOTIVATIONAL_MESSAGES.length]);
          setMessageIndex(prev => prev + 1);
      } else {
          setResultMessage('FALSE');
      }

      setExamState('RESULT');
  };

  const handleNextExam = async () => {
      if (currentQuestionNumber < totalQuestions) {
          setCurrentQuestionNumber(prev => prev + 1);
          startExam();
      } else {
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;

          await statsService.saveSession({
            game_type: 'WORM',
            score: correctAnswersCount,
            duration_seconds: duration,
            metadata: {
              total_questions: totalQuestions,
              difficulty: difficulty
            }
          });

          setExamState('SESSION_FINISHED');
      }
  };

  const switchToPractise = () => {
      setGameMode('PRACTISE');
      setExamState('IDLE');
      startPractiseMission(position, rotation);
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).slice(2, 11),
      message,
      timestamp: Date.now()
    }]);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrows and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    // Update pressed key visual
    setPressedKey(e.key);

    if (e.repeat) return;

    // Mission Validation Logic
    if (missionInstructions.length > 0 && currentStepIndex < missionInstructions.length) {
        const currentInstruction = missionInstructions[currentStepIndex];
        const expectedKey = currentInstruction.actions[currentSubStepIndex];
        
        // Map user input to standardized keys if needed (already standard)
        // Check if input matches expected
        if (e.key === expectedKey) {
            setIsError(false);
            
            // Advance sub-step
            if (currentSubStepIndex + 1 < currentInstruction.actions.length) {
                setCurrentSubStepIndex(prev => prev + 1);
            } else {
                // Advance main step
                setCurrentStepIndex(prev => prev + 1);
                setCurrentSubStepIndex(0);
            }
        } else {
            // Wrong key!
            // Ignore irrelevant keys? Or penalize all?
            // Let's penalize direction keys and space
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                setIsError(true);
            }
        }
    }

    switch (e.key) {
      case 'ArrowLeft':
        setRotation(prev => prev - 90);
        addLog("TURN TO THE LEFT");
        break;
      case 'ArrowRight':
        setRotation(prev => prev + 90);
        addLog("TURN TO THE RIGHT");
        break;
      case 'ArrowDown':
        setRotation(prev => prev + 180);
        addLog("TURN BACK");
        break;
      case ' ':
        addLog("GO AHEAD");
        // We calculate the new position based on CURRENT rotation state
        setPosition(prev => {
            const { x, y } = prev;
            let dx = 0;
            let dy = 0;
            
            const normalizedRotation = getNormalizedRotation(rotation);

            if (normalizedRotation === 0) dy = -1;
            else if (normalizedRotation === 90) dx = 1;
            else if (normalizedRotation === 180) dy = 1;
            else if (normalizedRotation === 270) dx = -1;
            
            const newX = Math.max(0, Math.min(GRID_SIZE - 1, x + dx));
            const newY = Math.max(0, Math.min(GRID_SIZE - 1, y + dy));
            
            // Check win condition
            if (targetPosition && newX === targetPosition.x && newY === targetPosition.y) {
                 // Victory! We can handle this later (e.g. generate new mission)
                 addLog("TARGET REACHED! 🎉");
                 // Generate new mission from new pos and rotation
                 // Small delay to let render happen
                 setTimeout(() => {
                     // We pass rotation because state update might be pending, but actually rotation doesn't change on move
                     startPractiseMission({ x: newX, y: newY }, rotation);
                 }, 500);
            }

            return { x: newX, y: newY };
        });
        break;
    }
  }, [rotation, targetPosition, missionInstructions, currentStepIndex, currentSubStepIndex, startPractiseMission, getNormalizedRotation]);

  const handleKeyUp = useCallback(() => {
    setPressedKey(null);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  // Allow guest access - we handle auth in LandingPage if needed
  // if (!user) {
  //   return <AuthPage onSuccess={() => {}} />;
  // }

  // ----------------------------------------------------------------------
  // RENDER LOGIC
  // ----------------------------------------------------------------------

  if (currentPage === 'MARKETING') {
    return (
      <MarketingPage 
        onStartDemo={() => setCurrentPage('LANDING')} 
        onViewProduct={() => setCurrentPage('SKYTEST_PRODUCT')}
        onNavigate={(page) => setCurrentPage(page as Page)}
        user={user}
        onSignOut={signOut}
      />
    );
  }

  if (currentPage === 'SKYTEST_BLOG_1') {
    return <SkytestBlogPage onNavigate={(page) => setCurrentPage(page as Page)} />;
  }

  if (currentPage === 'SKYTEST_PEGASUS_BLOG') {
    return <SkytestPegasusBlogPage onNavigate={(page) => setCurrentPage(page as Page)} />;
  }

  if (currentPage === 'SKYTEST_PREPARATION_BLOG') {
    return <SkytestPreparationBlogPage onNavigate={(page) => setCurrentPage(page as Page)} />;
  }

  if (currentPage === 'PRIVACY_POLICY') {
    return <PrivacyPolicyPage onBack={() => setCurrentPage('MARKETING')} />;
  }

  if (currentPage === 'TERMS_OF_SERVICE') {
    return <TermsOfServicePage onBack={() => setCurrentPage('MARKETING')} />;
  }

  if (currentPage === 'LEGAL_DISCLAIMER') {
    return <LegalDisclaimerPage onBack={() => setCurrentPage('MARKETING')} />;
  }

  if (currentPage === 'SKYTEST_PRODUCT') {
    return (
      <SkytestPage 
        onBack={() => setCurrentPage('MARKETING')}
        onStartFree={() => setCurrentPage('LANDING')}
        onNavigate={(page) => setCurrentPage(page as Page)}
      />
    );
  }

  if (currentPage === 'STATISTICS') {
    return <StatisticsPage onBack={() => setCurrentPage('LANDING')} />;
  }

  if (currentPage === 'LANDING') {
    return (
        <LandingPage 
            onSelectGame={(game) => setCurrentPage(game)} 
            onSignOut={signOut} 
            onShowStats={() => setCurrentPage('STATISTICS')}
            user={user}
            onGoHome={() => setCurrentPage('MARKETING')}
        />
    );
  }

  if (currentPage === 'VIGI') {
    return <VIGIGame onExit={() => setCurrentPage('LANDING')} />;
  }

  if (currentPage === 'VIGI1') {
    return <VIGI1Game onExit={() => setCurrentPage('LANDING')} />;
  }

  if (currentPage === 'CAPACITY') {
    return <CapacityGame onExit={() => setCurrentPage('LANDING')} />;
  }

  if (currentPage === 'IPP') {
    return <IPPGame onExit={() => setCurrentPage('LANDING')} />;
  }

  if (currentPage === 'CUBE') {
    return <CubeGame onExit={() => setCurrentPage('LANDING')} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 md:p-8 font-sans relative">
        <Toaster position="top-center" />
        <GameTutorial
            isOpen={isTutorialOpen}
            onClose={() => setIsTutorialOpen(false)}
            title="WORM"
            description="Visualize the movement! In an 8x8 grid, guide the Green Object (line-headed circle) to the Red Dot. Commands appear sequentially (e.g., TURN TO THE LEFT and GO AHEAD). Visualize these moves in your mind. At the end, 4 options appear. Select the grid where the Green Object lands on the Red Dot."
            initialLocale="tr"
            rules={[
                "Follow sequential commands: TURN TO THE LEFT/RIGHT/BACK and GO AHEAD.",
                "Visualize the moves mentally without seeing the object move.",
                "After commands end, choose the correct final position from 4 options.",
                "Orientation Tip: Directions are relative to the object's head.",
                "• Head Down (Circle Up): Right Turn → Moves Left on screen.",
                "• Head Left: Right Turn → Moves Up on screen.",
                "• Head Right: Right Turn → Moves Down on screen."
            ]}
            controls={[
                { key: "←", action: "Turn Left" },
                { key: "→", action: "Turn Right" },
                { key: "↓", action: "Turn Back" },
                { key: "SPACE", action: "Move Forward" }
            ]}
            ctaText="EXAM MODE"
            onCtaClick={() => {
                setIsTutorialOpen(false);
                if (!checkAccess('worm')) return;
                if (tier === 'GUEST') {
                    setDifficulty('EASY');
                }
                setGameMode('EXAM');
                startExamSession();
                setIsGameStarted(true);
            }}
            secondaryCtaText="PRACTISE"
            onSecondaryCtaClick={() => {
                setIsTutorialOpen(false);
                if (!checkAccess('worm')) return;
                if (tier === 'GUEST') {
                    setDifficulty('EASY');
                }
                setGameMode('PRACTISE');
                setIsGameStarted(true);
            }}
            translations={{
              tr: {
                title: "WORM",
                description: "8x8'lik 64 kareden oluşan bir alanda, yeşil renkli (baş kısmı çizgi olan) nesneyi kırmızı nokta ile buluşturmalısın. Ekrana sırasıyla rastgele komutlar gelir (örn: TURN TO THE LEFT and GO AHEAD). Bu komutları zihninde canlandırmalısın. Komutlar bittiğinde ekrana 4 farklı seçenek gelir. Hangi seçenekte yeşil nesnenin kırmızı noktanın üzerine geldiğini bulmalısın.",
                rules: [
                  "Komutları takip et: TURN TO THE LEFT/RIGHT/BACK and GO AHEAD.",
                  "Hareketleri zihninde canlandır.",
                  "4 seçenek arasından doğru konumu bul.",
                  "İpucu: Nesnenin yönüne göre sağ/sol değişir.",
                  "• Baş aşağı bakıyorsa (Daire yukarıda): Sağa dönmek = Sola (size göre).",
                  "• Baş sola bakıyorsa: Sağa dönmek = Yukarıya.",
                  "• Baş sağa bakıyorsa: Sağa dönmek = Aşağıya."
                ],
                controls: [
                  { key: "←", action: "Sola çevir" },
                  { key: "→", action: "Sağa çevir" },
                  { key: "↓", action: "Geri döndür" },
                  { key: "SPACE", action: "İleri hareket" }
                ],
                ctaText: "Sınav Modu",
                secondaryCtaText: "Alıştırma"
              },
              en: {
                title: "WORM",
                description: "Visualize the movement! In an 8x8 grid, guide the Green Object (line-headed circle) to the Red Dot. Commands appear sequentially (e.g., TURN TO THE LEFT and GO AHEAD). Visualize these moves in your mind. At the end, 4 options appear. Select the grid where the Green Object lands on the Red Dot.",
                rules: [
                    "Follow sequential commands: TURN TO THE LEFT/RIGHT/BACK and GO AHEAD.",
                    "Visualize the moves mentally without seeing the object move.",
                    "After commands end, choose the correct final position from 4 options.",
                    "Orientation Tip: Directions are relative to the object's head.",
                    "• Head Down (Circle Up): Right Turn → Moves Left on screen.",
                    "• Head Left: Right Turn → Moves Up on screen.",
                    "• Head Right: Right Turn → Moves Down on screen."
                ],
                controls: [
                    { key: "←", action: "Turn Left" },
                    { key: "→", action: "Turn Right" },
                    { key: "↓", action: "Turn Back" },
                    { key: "SPACE", action: "Move Forward" }
                ],
                ctaText: "EXAM MODE",
                secondaryCtaText: "PRACTISE"
              }
            }}
        />

        {/* Game Start Menu */}
        {!isGameStarted && !isSettingsOpen && (
             <GameStartMenu 
               title="WORM"
               onStart={() => {
                   if (!checkAccess('worm')) return;
                   if (tier === 'GUEST') {
                       setDifficulty('EASY');
                   }
                   setGameMode('EXAM');
                   startExamSession();
                   setIsGameStarted(true);
               }}
               onSettings={() => {
                   setIsSettingsOpen(true);
               }}
               onBack={() => setCurrentPage('LANDING')}
               onLearn={() => setIsTutorialOpen(true)}
             >
                <button 
                  onClick={() => {
                      if (!checkAccess('worm')) return;
                      if (tier === 'GUEST') {
                          setDifficulty('EASY');
                      }
                      setGameMode('PRACTISE');
                      setIsGameStarted(true);
                  }}
                  className="group flex items-center justify-center gap-3 w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg"
                >
                  <Gamepad2 size={24} className="fill-current" />
                  PRACTISE MODE
                </button>
             </GameStartMenu>
        )}

        {/* Game UI - Only show when started */}
        {isGameStarted && (
           <>
              {/* Top Right Controls */}
              <div className="fixed top-4 right-4 z-[60] flex flex-col gap-3">
                  {/* Tutorial Button */}
                  <button 
                      onClick={() => setIsTutorialOpen(true)}
                      className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 group relative"
                      title="How to Play"
                  >
                      <span className="text-xl font-bold text-gray-700">?</span>
                      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          How to Play
                      </span>
                  </button>

                  {/* Settings Button */}
                  <button 
                      onClick={() => {
                          setIsSettingsOpen(true);
                      }}
                      className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 group relative"
                      title="Settings"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Settings
                      </span>
                  </button>

                  {/* Practise Mode Button */}
                  <button 
                      onClick={() => {
                          if (tier === 'GUEST') {
                              setDifficulty('EASY');
                          }
                          switchToPractise();
                      }}
                      className={`p-3 backdrop-blur-sm rounded-full shadow-lg transition-all hover:scale-110 group relative ${gameMode === 'PRACTISE' ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                      title="Practise Mode"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Practise Mode
                      </span>
                  </button>

                  {/* Exam Mode Button */}
                  <button 
                      onClick={() => {
                          if (tier === 'GUEST') {
                              setDifficulty('EASY');
                          }
                          startExamSession();
                      }}
                      className={`p-3 backdrop-blur-sm rounded-full shadow-lg transition-all hover:scale-110 group relative ${gameMode === 'EXAM' ? 'bg-purple-600 text-white ring-4 ring-purple-200' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                      title="Exam Mode"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Exam Mode
                      </span>
                  </button>

                  {/* Exit/Back Button */}
                   <button 
                       onClick={() => setIsGameStarted(false)}
                       className="p-3 bg-red-500 text-white backdrop-blur-sm rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110 group relative"
                       title="Back to Menu"
                   >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                       </svg>
                       <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                           Exit
                       </span>
                   </button>
              </div>

              {gameMode === 'PRACTISE' && (
                <div className="flex flex-col xl:flex-row gap-8 items-start justify-center w-full max-w-7xl">
                    {/* Left Column: Mission */}
                    <div className="w-full xl:w-80 h-96 xl:h-[600px]">
                        <MissionPanel 
                            instructions={missionInstructions} 
                            currentStepIndex={currentStepIndex}
                            isError={isError}
                        />
                    </div>

                    {/* Middle Column: Grid */}
                    <div className="flex-1 w-full flex justify-center">
                        <Grid 
                            snakePosition={position} 
                            snakeRotation={rotation} 
                            targetPosition={targetPosition}
                        />
                    </div>
                    
                    {/* Right Column: Controls & Logs */}
                    <div className="flex flex-col gap-6 w-full xl:w-80">
                        <Controls pressedKey={pressedKey} />
                        <div className="h-64 xl:h-[400px] w-full">
                            <LogPanel logs={logs} />
                        </div>
                    </div>
                    
                    <div className="fixed bottom-8 text-gray-500 text-sm">
                        Use <kbd className="bg-gray-200 px-1 rounded">←</kbd> <kbd className="bg-gray-200 px-1 rounded">→</kbd> to rotate, <kbd className="bg-gray-200 px-1 rounded">↓</kbd> to turn back, and <kbd className="bg-gray-200 px-1 rounded">Space</kbd> to move.
                    </div>
                </div>
            )}

            {gameMode === 'EXAM' && (
                <div className="flex flex-col items-center w-full max-w-4xl">
                    {/* Header */}
                    <div className="w-full flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-100">
                        <div>
                            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                                Exam Session
                            </div>
                            <h2 className="text-3xl font-black text-gray-800">
                                Question {currentQuestionNumber} <span className="text-gray-300">/ {totalQuestions}</span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Difficulty
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                                {DIFFICULTY_SETTINGS[difficulty].label}
                            </div>
                        </div>
                    </div>

                    {/* Exam Content */}
                    <div className="w-full relative min-h-[600px] flex justify-center">
                        
                        {/* Instructions Overlay */}
                        {examState === 'SHOWING_INSTRUCTIONS' && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                <div className="bg-gray-900/90 backdrop-blur text-white px-12 py-8 rounded-3xl shadow-2xl transform transition-all animate-bounce-in text-center border-4 border-purple-500">
                                    <div className="text-4xl md:text-5xl font-black leading-tight">
                                        {examInstructions[currentInstructionIndex]?.text}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Options Selection */}
                        {examState === 'SELECTION' && (
                            <div className="grid grid-cols-2 gap-6 w-full animate-fade-in">
                                {examOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option)}
                                        className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all border-2 border-transparent hover:border-purple-400 group overflow-hidden"
                                    >
                                        <div className="absolute top-4 left-4 z-10 bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-lg group-hover:bg-purple-600 transition-colors">
                                            {option.id.includes('correct') ? '?' : '?'}
                                        </div>
                                        <div className="pointer-events-none transform scale-90">
                                            <Grid 
                                                snakePosition={option.snakePosition}
                                                snakeRotation={option.snakeRotation}
                                                targetPosition={option.targetPosition}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Result Feedback */}
                        {examState === 'RESULT' && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-md rounded-3xl animate-fade-in p-8">
                                <div className={`text-6xl md:text-8xl mb-6 animate-bounce-in ${examResult === 'CORRECT' ? 'text-green-500' : 'text-red-500'}`}>
                                    {examResult === 'CORRECT' ? '✓' : '✗'}
                                </div>
                                <h2 className={`text-4xl md:text-5xl font-black mb-8 text-center ${examResult === 'CORRECT' ? 'text-green-400' : 'text-red-400'}`}>
                                    {resultMessage}
                                </h2>

                                {/* Show Correct Option and Instructions if Wrong */}
                                {examResult === 'FALSE' && (
                                    <div className="flex flex-col xl:flex-row gap-8 items-center justify-center w-full max-w-6xl mb-8">
                                        {/* Correct Option Preview */}
                                        {examOptions.find(o => o.isCorrect) && (
                                            <div className="relative bg-white p-4 rounded-2xl shadow-2xl ring-4 ring-green-500 transform transition-all hover:scale-105">
                                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg z-10 whitespace-nowrap border-2 border-white">
                                                    CORRECT OPTION
                                                </div>
                                                <div className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] pointer-events-none">
                                                    <Grid 
                                                        snakePosition={examOptions.find(o => o.isCorrect)!.snakePosition}
                                                        snakeRotation={examOptions.find(o => o.isCorrect)!.snakeRotation}
                                                        targetPosition={examOptions.find(o => o.isCorrect)!.targetPosition}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Instructions List */}
                                        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 overflow-y-auto max-h-[350px]">
                                            <h3 className="text-gray-400 font-bold uppercase text-sm mb-4 border-b border-gray-600 pb-2">Correct Instructions</h3>
                                            <ul className="space-y-3 text-left">
                                                {examInstructions.map((step, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-white font-bold text-lg">
                                                        <span className="bg-purple-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm flex-shrink-0 shadow-lg border border-purple-400">
                                                            {idx + 1}
                                                        </span>
                                                        <span>{step.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={handleNextExam}
                                    className="px-12 py-4 bg-purple-600 text-white rounded-xl font-bold text-xl hover:bg-purple-700 transition-all hover:scale-105 shadow-xl ring-4 ring-purple-900/50"
                                >
                                    {currentQuestionNumber < totalQuestions ? 'Next Question →' : 'Finish Exam'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Session Finished Screen */}
                    {examState === 'SESSION_FINISHED' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-50">
                            <h2 className="text-5xl font-black mb-8 text-purple-400">EXAM FINISHED!</h2>
                            
                            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl text-center w-full max-w-lg border-4 border-gray-700">
                                <div className="mb-8">
                                    <div className="text-gray-400 text-xl mb-2">ACCURACY</div>
                                    <div className={`text-7xl font-black ${correctAnswersCount === totalQuestions ? 'text-green-500' : 'text-blue-500'}`}>
                                        {Math.round((correctAnswersCount / totalQuestions) * 100)}%
                                    </div>
                                </div>
                                
                                <div className="flex justify-center gap-12 text-2xl font-bold mb-8">
                                    <div className="text-green-400">
                                        <div className="text-sm text-gray-500 uppercase">Correct</div>
                                        {correctAnswersCount}
                                    </div>
                                    <div className="text-red-400">
                                        <div className="text-sm text-gray-500 uppercase">Wrong</div>
                                        {totalQuestions - correctAnswersCount}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button 
                                        onClick={startExamSession}
                                        className="w-full py-4 bg-purple-600 rounded-xl font-bold text-xl hover:bg-purple-700 transition-colors"
                                    >
                                        Restart Exam
                                    </button>
                                    <button 
                                        onClick={() => setIsGameStarted(false)}
                                        className="w-full py-4 bg-gray-700 rounded-xl font-bold text-xl hover:bg-gray-600 transition-colors"
                                    >
                                        Back to Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
           </>
        )}

        {/* Settings Modal - Always available if state is open */}
        <GameSettingsModal
            isOpen={isSettingsOpen}
            onClose={handleSettingsClose}
            title="Game Settings"
            onInfoClick={() => alert("Ayarlar, gerçek sınav koşullarına göre test zorluğunu ve süreyi değiştirir.")}
        >
            {/* Instruction Speed */}
            <SettingsSection title="Instruction Speed">
                <SettingsLabel>Speed: {instructionSpeed}ms</SettingsLabel>
                <SettingsRange 
                    value={instructionSpeed} 
                    min={200} 
                    max={2000} 
                    step={100}
                    onChange={(val) => setInstructionSpeed(val)}
                    leftLabel="Fast (200ms)"
                    rightLabel="Slow (2000ms)"
                    isLocked={tier !== 'PRO'}
                    onLockedClick={() => {
                        setProModalVariant('exam-settings');
                        openProModal();
                    }}
                />
            </SettingsSection>

            {/* Difficulty */}
            <SettingsSection title="Difficulty">
                {/* Question Count */}
                <div className="mb-4">
                     <SettingsLabel>Number of Questions: {totalQuestions}</SettingsLabel>
                     <SettingsRange
                        value={totalQuestions}
                        min={1}
                        max={20}
                        onChange={(val) => setTotalQuestions(val)}
                        leftLabel="1 Question"
                        rightLabel="20 Questions"
                        isLocked={tier !== 'PRO'}
                        onLockedClick={() => {
                            setProModalVariant('exam-settings');
                            openProModal();
                        }}
                     />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(DIFFICULTY_SETTINGS) as DifficultyLevel[]).map((level) => {
                        const isLocked = tier !== 'PRO' && level !== 'EASY';
                        const isSelected = difficulty === level;
                        
                        return (
                            <button
                                key={level}
                                onClick={() => {
                                    if (isLocked) {
                                        setProModalVariant('exam-settings');
                                        openProModal();
                                    } else {
                                        setDifficulty(level);
                                    }
                                }}
                                className={`relative group p-3 rounded-lg border-2 text-sm font-bold transition-all
                                    ${isSelected 
                                        ? 'border-purple-600 bg-purple-50 text-purple-700' 
                                        : (isLocked ? 'border-gray-200 text-gray-400 bg-gray-50' : 'border-gray-200 text-gray-500 hover:border-gray-300')}
                                `}
                                title={level !== 'EASY' ? "Gerçek sınav temposu" : ""}
                            >
                                {isLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-lg">
                                        <Lock size={16} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="uppercase mb-1">{level}</div>
                                <div className="text-xs opacity-75">
                                    {level === 'EASY' ? '(Mini deneme – 2 dk)' : `${DIFFICULTY_SETTINGS[level].min}-${DIFFICULTY_SETTINGS[level].max} Steps`}
                                </div>
                                {isLocked && (
                                    <div className="text-[10px] text-gray-400 mt-1 font-medium">Pro ile açılır</div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </SettingsSection>
        </GameSettingsModal>

        {/* Pro Access Modal */}
        {showProModal && (
            <ProAccessModal 
                isOpen={showProModal} 
                onClose={() => { closeProModal(); setProModalVariant('default'); }}
                onUpgrade={handleUpgrade}
                variant={proModalVariant}
                title={proModalVariant === 'exam-settings' ? "Gerçek Sınav Ayarları" : undefined}
                description={proModalVariant === 'exam-settings' ? "Orta ve zor seviye ayarlar, zaman baskısı ve görev yoğunluğu açısından gerçek sınav koşullarına en yakın yapılandırmadır. Bu ayarlar yalnızca Pro üyelikte açılır." : undefined}
                ctaText={proModalVariant === 'exam-settings' ? "Pro’ya Geç – Gerçek Sınav Modu" : undefined}
                trustText={proModalVariant === 'exam-settings' ? "İstediğin zaman iptal edebilirsin." : undefined}
            />
        )}

        {/* Smart Login Gate */}
        <SmartLoginGate
            isOpen={showLoginGate}
            onClose={handleLoginClose}
            onLoginSuccess={handleLoginSuccess}
        />
    </div>
  );
}

export default App;
