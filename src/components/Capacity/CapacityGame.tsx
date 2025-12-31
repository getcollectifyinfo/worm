import React, { useState, useEffect } from 'react';
import './Capacity.css';
import GameCanvas from './GameCanvas';
import SidePanel from './SidePanel';
import SettingsMenu from './SettingsMenu';
import type { CapacitySettings, CapacityStats } from './types';
import { GameStartMenu } from '../GameStartMenu';
import { GameTutorial } from '../GameTutorial';
import { statsService } from '../../services/statsService';
import { HelpCircle, Settings, Pause, Play, LogOut } from 'lucide-react';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';
import { SmartLoginGate } from '../Auth/SmartLoginGate';
import { MiniExamEndModal } from '../MiniExamEndModal';

import { GameResultsModal } from '../GameResultsModal';

interface CapacityGameProps {
  onExit: () => void;
}

const CapacityGame: React.FC<CapacityGameProps> = ({ onExit }) => {
  const { 
    tier, 
    checkAccess, 
    showProModal, 
    closeProModal, 
    openProModal, 
    handleUpgrade, 
    showLoginGate, 
    closeLoginGate, 
    openLoginGate 
  } = useGameAccess();

  const [isFirePressed, setIsFirePressed] = useState(false);
  const [spacePressTimestamp, setSpacePressTimestamp] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [showMiniExamModal, setShowMiniExamModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
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
    // Check access (assume 'capacity' module ID)
    if (!checkAccess('capacity')) return;

    setGameMode('DICE'); // Always start with DICE
    
    let duration = settings.gameDuration;
    
    // GUEST/FREE Restrictions
    if (tier !== 'PRO') {
        duration = 120; // 2 minutes fixed
        setSettings(prev => ({
            ...prev,
            gameDuration: 120,
            planeSpeed: 0.0005, // Slowest
            scrollSpeed: 0.05,
            spawnRate: 800,
            taskChangeSpeed: 3000
        }));
    }

    setTimeLeft(duration); 
    
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

  const [gameDuration, setGameDuration] = useState(0);

  // Handle Game Finish
  const finishGame = React.useCallback(async () => {
      setGameState('finished');
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setGameDuration(Math.round(duration));
      
      // Calculate total score
      const totalHits = diceStats.hits + rodStats.hits;
      
      // Save stats if allowed
      if (tier !== 'GUEST') {
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
      }

      // Show Mini Exam End Modal for Non-Pro
      if (tier !== 'PRO') {
          setShowMiniExamModal(true);
      } else {
          setShowResults(true);
      }
  }, [startTime, diceStats, rodStats, flightFails, totalObstacles, tier]);

  // Timer
  useEffect(() => {
    if (gameState !== 'running' || isPaused) return;

    const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  // Game Logic (Phase Switch & End)
  useEffect(() => {
      if (gameState !== 'running') return;

      // Game Over
      if (timeLeft <= 0) {
          // Wrap in setTimeout to avoid synchronous state update in effect
          setTimeout(() => finishGame(), 0);
          return;
      }

      // Switch Phase at Half Time
      const halfTime = Math.floor(settings.gameDuration / 2);
      if (gameMode === 'DICE' && timeLeft === halfTime) {
           setTimeout(() => setGameMode('ROD'), 0);
      }
  }, [timeLeft, gameState, gameMode, settings.gameDuration, finishGame]);

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
        initialLocale="tr"
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
        translations={{
          tr: {
            title: "CAPACITY",
            description: "Çoklu görev yükü! Uçağı uçururken eşleştirme görevini de takip et.",
            rules: [
              "Sol panel (Uçuş): Uçağı boşluklardan geçir.",
              "Sol/Sağ ok tuşlarıyla uçağı hareket ettir.",
              "Sağ panel (Eşleştirme): İki öğeyi izle (Zar veya Çubuk).",
              "AYNI iseler SPACE (Ateş) tuşuna bas.",
              "Farklıysa yok say.",
              "Oyun Zar ve Çubuk modları arasında otomatik geçer.",
              "Mümkün olduğunca uzun süre hayatta kal ve her iki görevde yüksek skor yap."
            ],
            controls: [
              { key: "← / →", action: "Uçağı hareket ettir" },
              { key: "SPACE", action: "Eşleşmeyi onayla (Sağ panel)" },
              { key: "P / ESC", action: "Duraklat" }
            ],
            ctaText: "Tamam"
          }
        }}
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
            onPractice={() => setShowSettings(true)}
            onBack={onExit}
            onLearn={() => setIsTutorialOpen(true)}
            tier={tier}
          />
      )}

      {showSettings && (
          <SettingsMenu 
              settings={settings}
              onUpdateSettings={updateSettings}
              onClose={() => setShowSettings(false)}
              tier={tier}
              onOpenProModal={openProModal}
          />
      )}

      {/* Modals */}
      <ProAccessModal
        isOpen={showProModal}
        onClose={closeProModal}
        onUpgrade={() => handleUpgrade('capacity-settings')}
      />

      <SmartLoginGate
        isOpen={showLoginGate}
        onClose={closeLoginGate}
        onLoginSuccess={() => {
            closeLoginGate();
            const pending = localStorage.getItem('pending_pro_upgrade');
            if (pending) {
                localStorage.removeItem('pending_pro_upgrade');
                handleUpgrade('capacity-login');
            }
        }}
      />

      <MiniExamEndModal
        isOpen={showMiniExamModal}
        onClose={() => setShowMiniExamModal(false)}
        onUpgrade={() => {
            setShowMiniExamModal(false);
            if (tier === 'GUEST') {
                localStorage.setItem('pending_pro_upgrade', 'true');
                openLoginGate();
            } else {
                handleUpgrade('capacity-end');
            }
        }}
        onPractice={() => {
             setShowMiniExamModal(false);
             setShowSettings(true);
        }}
      />

      <GameResultsModal
        isOpen={showResults}
        score={diceStats.hits + rodStats.hits}
        duration={`${gameDuration}s`}
        tier={tier}
        onRetry={() => {
            setShowResults(false);
            startNewGame();
        }}
        onExit={onExit}
      >
         <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-800 p-3 rounded-lg text-center">
                 <h4 className="text-gray-400 text-xs uppercase mb-2">Flight</h4>
                 <div className="text-2xl font-bold text-white">
                     {totalObstacles > 0 ? Math.round(((totalObstacles - flightFails) / totalObstacles) * 100) : 100}%
                 </div>
                 <div className="text-xs text-red-400 mt-1">{flightFails} Fails</div>
             </div>
             <div className="bg-gray-800 p-3 rounded-lg text-center">
                 <h4 className="text-gray-400 text-xs uppercase mb-2">Matching</h4>
                 <div className="text-2xl font-bold text-white">
                    {(diceStats.targets + rodStats.targets) > 0 ? Math.round(((diceStats.hits + rodStats.hits) / (diceStats.targets + rodStats.targets)) * 100) : 0}%
                 </div>
                 <div className="text-xs text-red-400 mt-1">{diceStats.fails + rodStats.fails} Fails</div>
             </div>
         </div>
      </GameResultsModal>

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
