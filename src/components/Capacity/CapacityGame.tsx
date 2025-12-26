import React, { useState, useEffect } from 'react';
import './Capacity.css';
import GameCanvas from './GameCanvas';
import SidePanel from './SidePanel';
import SettingsMenu from './SettingsMenu';
import type { CapacitySettings, CapacityStats } from './types';
import { GameStartMenu } from '../GameStartMenu';
import { GameTutorial } from '../GameTutorial';
import { statsService } from '../../services/statsService';

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

  const handleUpdateTaskStats = (newStats: Partial<CapacityStats>) => {
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
  };

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

      {/* Back Button for Navigation - Only show when not in menu (GameStartMenu has its own back) */}
      {gameState !== 'menu' && (
        <>
            <button 
              onClick={onExit}
              className="fixed top-4 left-4 z-[2000] p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
              title="Back to Main Menu"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="fixed top-4 right-4 z-[2000] p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 font-bold text-xl w-10 h-10 flex items-center justify-center text-gray-700"
              title="How to Play"
            >
               ?
            </button>
        </>
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
            onFail={() => setFlightFails(prev => prev + 1)} 
            onObstaclePassed={() => setTotalObstacles(prev => prev + 1)}
            onFireStart={handleFireStart}
            onFireEnd={handleFireEnd}
        />
        <div className="capacity-fire-button-container">
          <button 
            className={`capacity-fire-button ${isFirePressed ? 'active' : ''}`}
            onMouseDown={() => {
                if (!isPaused && gameState === 'running') {
                    setIsFirePressed(true);
                    setSpacePressTimestamp(Date.now());
                }
            }}
            onMouseUp={() => setIsFirePressed(false)}
            onMouseLeave={() => setIsFirePressed(false)}
          >
            FIRE (SPACE)
          </button>
        </div>
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
