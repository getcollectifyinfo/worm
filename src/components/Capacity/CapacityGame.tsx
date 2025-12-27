import React, { useState, useEffect } from 'react';
import './Capacity.css';
import GameCanvas from './GameCanvas';
import SidePanel from './SidePanel';
import SettingsMenu from './SettingsMenu';
import type { CapacitySettings, CapacityStats } from './types';
import { GameStartMenu } from '../GameStartMenu';
import { GameTutorial } from '../GameTutorial';
import { statsService } from '../../services/statsService';
import { HelpCircle, Settings, Pause, Play, LogOut, Home, Target } from 'lucide-react';

interface CapacityGameProps {
  onExit: () => void;
}

const CapacityGame: React.FC<CapacityGameProps> = ({ onExit }) => {
  const [isFirePressed, setIsFirePressed] = useState(false);
  const [spacePressTimestamp, setSpacePressTimestamp] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  // Game State
  const [gameState, setGameState] = useState<'menu' | 'waiting' | 'reference' | 'running' | 'finished'>('menu');
  const [gameMode, setGameMode] = useState<'DICE' | 'ROD' | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  
  // Stats
  const [flightFails, setFlightFails] = useState(0);
  const [totalObstacles, setTotalObstacles] = useState(0);
  
  const [diceStats, setDiceStats] = useState<CapacityStats>({ hits: 0, targets: 0, fails: 0 });
  const [rodStats, setRodStats] = useState<CapacityStats>({ hits: 0, targets: 0, fails: 0 });
  
  const [startTime, setStartTime] = useState(0);

  // Pause & Settings
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CapacitySettings>({
    planeSpeed: 0.0008,
    scrollSpeed: 0.1,
    spawnRate: 600,
    taskChangeSpeed: 2000,
    gameDuration: 120
  });

  const togglePause = () => {
      setIsPaused(prev => !prev);
  };

  // --- NEW FIRE HANDLERS ---
  const handleFireStart = React.useCallback(() => {
      if (!isPaused && gameState === 'running') {
          setIsFirePressed(true);
          setSpacePressTimestamp(Date.now());
      }
  }, [isPaused, gameState]);

  const handleFireEnd = React.useCallback(() => {
      setIsFirePressed(false);
  }, []);
  // -------------------------

  // Handle Keys (Space & Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!e.repeat) {
            handleFireStart();
        }
      }
      
      if (e.code === 'Escape' || e.code === 'KeyP') {
          if (gameState === 'running' || isPaused) {
              togglePause();
          }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleFireEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, isPaused, handleFireStart, handleFireEnd]);

  const updateSettings = (newSettings: Partial<CapacitySettings>) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleUpdateTaskStats = React.useCallback((newStats: Partial<CapacityStats>) => {
      if (gameMode === 'DICE') {
          setDiceStats(prev => ({
              hits: prev.hits + (newStats.hits || 0),
              targets: prev.targets + (newStats.targets || 0),
              fails: prev.fails + (newStats.fails || 0)
          }));
      } else if (gameMode === 'ROD') {
          setRodStats(prev => ({
              hits: prev.hits + (newStats.hits || 0),
              targets: prev.targets + (newStats.targets || 0),
              fails: prev.fails + (newStats.fails || 0)
          }));
      }
  }, [gameMode]);

  const handleFail = React.useCallback(() => {
      setFlightFails(prev => prev + 1);
  }, []);

  const handleObstaclePassed = React.useCallback(() => {
      setTotalObstacles(prev => prev + 1);
  }, []);

  const startNewGame = () => {
    setGameMode('DICE'); // Always start with DICE
    setTimeLeft(settings.gameDuration); // Use configured duration
    
    // Reset Stats
    setFlightFails(0);
    setTotalObstacles(0);
    setDiceStats({ hits: 0, targets: 0, fails: 0 });
    setRodStats({ hits: 0, targets: 0, fails: 0 });
    
    setIsPaused(false);
    setStartTime(Date.now());
    
    setGameState('reference');
    // Reference phase 2 seconds, then running
    setTimeout(() => {
        setGameState('running');
    }, 2000);
  };

  // Handle Game Finish
  const finishGame = React.useCallback(async () => {
      setGameState('finished');
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      // Calculate total score
      const totalHits = diceStats.hits + rodStats.hits;
      
      await statsService.saveSession({
          game_type: 'CAPACITY',
          score: totalHits,
          duration_seconds: duration,
          metadata: {
              flight_fails: flightFails,
              total_obstacles: totalObstacles,
              dice_stats: diceStats,
              rod_stats: rodStats
          }
      });
  }, [startTime, diceStats, rodStats, flightFails, totalObstacles]);

  // Timer
  useEffect(() => {
    if (gameState !== 'running' || isPaused) return;

    const interval = setInterval(() => {
        setTimeLeft(prev => {
            // Check for game switch
            if (gameMode === 'DICE' && prev === Math.floor(settings.gameDuration / 2)) {
                setGameMode('ROD');
            }

            if (prev <= 1) {
                finishGame();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isPaused, gameMode, settings.gameDuration, finishGame]);

  const handleRestart = () => {
      // Instead of reload, we reset to menu
      setGameState('menu');
      setIsPaused(false);
  };

  return (
    <div className="capacity-container">
      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="CAPACITY"
        description="Multitasking Overload! Pilot your plane while monitoring a secondary matching task."
        rules={[
            "Left Panel (Flight): Guide the plane through gaps.",
            "Use Left/Right Arrow keys to move the plane.",
            "Right Panel (Matching): Watch the two items (Dice or Rods).",
            "If they are IDENTICAL, press SPACE (Fire).",
            "Ignore if they are different.",
            "The game switches between Dice and Rod modes automatically.",
            "Survive as long as possible and score high on both tasks!"
        ]}
        controls={[
            { key: "← / →", action: "Move Plane" },
            { key: "SPACE", action: "Confirm Match (Right Panel)" },
            { key: "P / ESC", action: "Pause Game" }
        ]}
      />

      {/* In-Game Controls (Top Right) */}
      {gameState !== 'menu' && (
        <div className="fixed top-4 right-4 z-[2000] flex flex-col gap-3">
            {/* Tutorial */}
            <button 
              onClick={() => {
                  if (gameState === 'running') setIsPaused(true);
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
                  if (gameState === 'running') setIsPaused(true);
                  setShowSettings(true);
              }}
              className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 group relative border border-slate-700 text-white"
              title="Settings"
            >
               <Settings size={24} />
            </button>

            {/* Pause/Resume */}
            {(gameState === 'running' || isPaused) && (
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
              onClick={onExit}
              className="p-3 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110 group relative border border-red-500 text-white"
              title="Exit to Main Menu"
            >
               <LogOut size={24} />
            </button>
        </div>
      )}

      {gameState === 'menu' && !showSettings && (
          <GameStartMenu
            title="CAPACITY"
            onStart={startNewGame}
            onSettings={() => setShowSettings(true)}
            onBack={onExit}
            onTutorial={() => setIsTutorialOpen(true)}
          />
      )}

      {showSettings && (
          <SettingsMenu 
              settings={settings}
              onUpdateSettings={updateSettings}
              onClose={() => setShowSettings(false)}
          />
      )}
      <div className="capacity-left-panel">
        <GameCanvas 
            gameState={gameState} 
            isPaused={isPaused}
            settings={settings}
            flightFails={flightFails}
            totalObstacles={totalObstacles}
            onFail={handleFail} 
            onObstaclePassed={handleObstaclePassed}
            onFireStart={handleFireStart}
            onFireEnd={handleFireEnd}
        />
      </div>
      <div className="capacity-right-panel">
        <SidePanel 
            lastSpacePressTime={spacePressTimestamp} 
            gameState={gameState}
            gameMode={gameMode}
            timeLeft={timeLeft}
            flightFails={flightFails}
            totalObstacles={totalObstacles}
            diceStats={diceStats}
            rodStats={rodStats}
            currentStats={gameMode === 'DICE' ? diceStats : rodStats}
            isPaused={isPaused}
            settings={settings}
            isFirePressed={isFirePressed}
            onFireStart={handleFireStart}
            onFireEnd={handleFireEnd}
            onRestart={handleRestart}
            onStartGame={startNewGame}
            onTogglePause={togglePause}
            onExitGame={onExit} // When exiting from pause/results, go to main menu
            onOpenSettings={() => setShowSettings(true)}
            onUpdateTaskStats={handleUpdateTaskStats}
        />
      </div>
    </div>
  )
}

export default CapacityGame;
