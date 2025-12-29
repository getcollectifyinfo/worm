import React, { useState, useEffect } from 'react';
import Shape from './VIGIShape';
import { useGameLogic } from './useVIGIGameLogic';
import { GameStartMenu } from '../GameStartMenu';
import { GameTutorial } from '../GameTutorial';
import { GameSettingsModal, SettingsSection, SettingsLabel, SettingsRange } from '../GameSettingsModal';
import { statsService } from '../../services/statsService';
import { HelpCircle, Settings, Pause, Play, LogOut } from 'lucide-react';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';

interface VIGIGameProps {
  onExit: () => void;
}

const VIGIGame: React.FC<VIGIGameProps> = ({ onExit }) => {
  const { gameState, actions, settings: gameSettings } = useGameLogic();
  const { isPlaying, isPaused, score, highScore, gameTime, level, position, shape, color, totalEvents, caughtEvents, wrongMoves } = gameState;
  const { startGame, stopGame, togglePause, handleInteraction, setSettings } = actions;
  const { checkAccess, maxDuration, canRecordStats, tier, showProModal, openProModal, closeProModal, handleUpgrade } = useGameAccess();

  // Duration Timer
  useEffect(() => {
    if (isPlaying && maxDuration > 0) {
      const timer = setTimeout(() => {
        stopGame();
        openProModal();
      }, maxDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, maxDuration, stopGame, openProModal]);

  // Calculate position
  const getPositionStyle = (pos: number) => {
    // 12 positions, 0 at top (12 o'clock)
    // Angle in degrees: pos * 30
    // To start at top, subtract 90 degrees
    const angle = (pos * 30 - 90) * (Math.PI / 180);
    // Using percentages for responsiveness
    // Center is 50, 50
    // x = 50 + r * cos
    // y = 50 + r * sin
    // r in %? Let's say 30%
    const r = 30; 
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  // Button handlers
  const onBtnClick = (type: 'JUMP' | 'COLOR' | 'TURN' | 'SHAPE') => {
    handleInteraction(type);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const handlePause = () => {
    togglePause();
    setShowPauseMenu(true);
  };

  const handleResume = () => {
    // Just close menu, keep game paused until bottom button is clicked
    setShowPauseMenu(false);
  };

  const handleSettingsFromPause = () => {
    setShowPauseMenu(false);
    setShowSettings(true);
  };

  const handleQuitFromPause = async () => {
    stopGame();
    
    // Save Stats if allowed
    if (canRecordStats) {
      await statsService.saveSession({
        game_type: 'VIGI',
        score: score,
        duration_seconds: gameTime,
        metadata: {
            level: level.name,
            total_events: totalEvents,
            caught_events: caughtEvents,
            wrong_moves: wrongMoves
        }
      });
    }

    setShowPauseMenu(false);
    onExit();
  };

  const handleStartGame = () => {
    if (!checkAccess('vigi')) return;
    startGame();
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden select-none font-mono">
      <ProAccessModal isOpen={showProModal} onClose={closeProModal} onUpgrade={handleUpgrade} />
      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="VIGI 2"
        description="Vigilance Test! Monitor the moving object and react instantly to specific changes in its behavior."
        rules={[
            "Watch the object moving in the circle.",
            "Detect changes in its properties:",
            "- JUMP: Object skips a position",
            "- COLOR: Object changes color",
            "- TURN: Object changes rotation direction",
            "- SHAPE: Object changes shape",
            "Press the corresponding button immediately when a change occurs.",
            "Be quick! You have a limited time to react."
        ]}
        controls={[
            { key: "Top Left Btn", action: "Report JUMP", icon: <span className="text-xl">↖️</span> },
            { key: "Top Right Btn", action: "Report COLOR", icon: <span className="text-xl">↗️</span> },
            { key: "Bot Left Btn", action: "Report TURN", icon: <span className="text-xl">↙️</span> },
            { key: "Bot Right Btn", action: "Report SHAPE", icon: <span className="text-xl">↘️</span> }
        ]}
      />

      {/* Top Right Standard Menu */}
      {isPlaying && (
      <div className="absolute top-4 right-4 z-[2000] flex flex-col gap-3 pointer-events-none">
          {/* Tutorial */}
          <button 
            onClick={() => {
                if (isPlaying && !isPaused) handlePause();
                setIsTutorialOpen(true);
            }}
            className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 group relative border border-slate-700 text-white pointer-events-auto"
            title="How to Play"
          >
             <HelpCircle size={24} />
          </button>
          {/* Settings */}
          <button 
            onClick={() => {
                if (isPlaying && !isPaused) handlePause();
                setShowSettings(true);
            }}
            className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 group relative border border-slate-700 text-white pointer-events-auto"
            title="Settings"
          >
             <Settings size={24} />
          </button>
          {/* Pause/Resume - Only when playing */}
          {isPlaying && (
              <button 
                onClick={() => {
                    if (isPaused) togglePause();
                    else handlePause();
                }}
                className={`p-3 backdrop-blur-sm rounded-full shadow-lg transition-all hover:scale-110 group relative border text-white pointer-events-auto ${isPaused ? 'bg-amber-600/90 border-amber-500 hover:bg-amber-600' : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'}`}
                title={isPaused ? "Resume" : "Pause"}
              >
                 {isPaused ? <Play size={24} /> : <Pause size={24} />}
              </button>
          )}
          {/* Exit */}
          <button 
            onClick={onExit}
            className="p-3 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110 group relative border border-red-500 text-white pointer-events-auto"
            title="Exit to Main Menu"
          >
             <LogOut size={24} />
          </button>
      </div>
      )}

      {/* Start Button Overlay */}
      {!isPlaying && !showSettings && (
        <GameStartMenu 
            title="VIGI"
            startLabel={totalEvents > 0 ? "PLAY AGAIN" : "START GAME"}
            onStart={handleStartGame}
            onSettings={() => {
                if (tier === 'GUEST' || tier === 'FREE') {
                    openProModal();
                } else {
                    setShowSettings(true);
                }
            }}
            onBack={onExit}
            highScore={highScore}
            onTutorial={() => setIsTutorialOpen(true)}
        />
      )}

      {/* Game Content Wrapper - Scaled and moved left */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[calc(100%-100px)] h-[90%] pointer-events-none">
          {/* HUD */}
          {isPlaying && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10 flex flex-col items-center pointer-events-auto">
            <div className="flex items-end gap-4">
                <div className="text-4xl font-bold mb-1">{score}</div>
                <div className="text-xl text-yellow-400 mb-2">{level.name}</div>
                <div className="text-sm text-gray-300 mb-2">{formatTime(gameTime)}</div>
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <div>HIGH: {highScore}</div>
              <div>ACC: {caughtEvents}/{totalEvents}</div>
              <div className="text-red-400">ERR: {wrongMoves}</div>
            </div>
          </div>
          )}

          {/* Game Area */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* The Moving Shape */}
            <div 
              className="absolute transition-all duration-300 ease-linear"
              style={getPositionStyle(position)}
            >
              <Shape type={shape} color={color} size={60} />
            </div>
          </div>

          {/* Controls - 4 Corners */}
          {isPlaying && (
          <>
          {/* Top Left - JUMP */}
          <button 
            onClick={() => onBtnClick('JUMP')}
            className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 flex items-start justify-start p-4 bg-transparent active:bg-white/10 outline-none pointer-events-auto"
          >
            <div className="w-full h-full border-t-4 border-l-4 border-purple-500 rounded-tl-3xl p-2">
              <span className="text-purple-400 font-bold text-lg md:text-xl">JUMP</span>
            </div>
          </button>

          {/* Top Right - COLOR */}
          <button 
            onClick={() => onBtnClick('COLOR')}
            className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 flex items-start justify-end p-4 bg-transparent active:bg-white/10 outline-none pointer-events-auto"
          >
            <div className="w-full h-full border-t-4 border-r-4 border-blue-500 rounded-tr-3xl p-2 text-right">
              <span className="text-blue-400 font-bold text-lg md:text-xl">COLOR</span>
            </div>
          </button>

          {/* Bottom Left - TURN */}
          <button 
            onClick={() => onBtnClick('TURN')}
            className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 flex items-end justify-start p-4 bg-transparent active:bg-white/10 outline-none pointer-events-auto"
          >
            <div className="w-full h-full border-b-4 border-l-4 border-yellow-500 rounded-bl-3xl p-2 flex items-end">
              <span className="text-yellow-400 font-bold text-lg md:text-xl">TURN</span>
            </div>
          </button>

          {/* Bottom Right - SHAPE */}
          <button 
            onClick={() => onBtnClick('SHAPE')}
            className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 flex items-end justify-end p-4 bg-transparent active:bg-white/10 outline-none pointer-events-auto"
          >
            <div className="w-full h-full border-b-4 border-r-4 border-green-500 rounded-br-3xl p-2 flex items-end justify-end">
              <span className="text-green-400 font-bold text-lg md:text-xl">SHAPE</span>
            </div>
          </button>
          </>
          )}
      </div>
      
      {/* Pause Menu */}
      {showPauseMenu && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 backdrop-blur-sm">
          <div className="flex flex-col gap-4 min-w-[200px]">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">PAUSED</h2>
            <button 
              onClick={handleResume}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition-colors"
            >
              RESUME
            </button>
            <button 
              onClick={handleSettingsFromPause}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors"
            >
              SETTINGS
            </button>
            <button 
              onClick={handleQuitFromPause}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold transition-colors"
            >
              QUIT GAME
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <GameSettingsModal
        isOpen={showSettings}
        onClose={() => {
            setShowSettings(false);
            if (isPlaying) setShowPauseMenu(true);
        }}
        title="VIGI Settings"
      >
        <SettingsSection>
            <SettingsRange
                min={500}
                max={2000}
                step={100}
                value={gameSettings.baseSpeed}
                onChange={(val) => setSettings(s => ({...s, baseSpeed: val}))}
                leftLabel="Fast (500ms)"
                rightLabel="Slow (2000ms)"
                valueLabel={<>Base Speed: <span className="text-purple-600 font-bold">{gameSettings.baseSpeed}ms</span></>}
            />
        </SettingsSection>

        <SettingsSection>
            <SettingsRange
                min={0.1}
                max={0.9}
                step={0.1}
                value={gameSettings.changeFrequency}
                onChange={(val) => setSettings(s => ({...s, changeFrequency: val}))}
                leftLabel="Rare"
                rightLabel="Frequent"
                valueLabel={<>Change Frequency: <span className="text-purple-600 font-bold">{gameSettings.changeFrequency}</span></>}
            />
        </SettingsSection>

        <SettingsSection title="Score Thresholds">
            <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-100">
               <h3 className="font-bold mb-3 text-green-700">Excellent Score</h3>
               <div className="flex gap-4">
                 <div className="flex-1">
                   <SettingsLabel>Time (ms)</SettingsLabel>
                   <input 
                     type="number" 
                     value={gameSettings.scoreWindows.excellent.time}
                     onChange={(e) => setSettings(s => ({
                       ...s, 
                       scoreWindows: {
                         ...s.scoreWindows,
                         excellent: { ...s.scoreWindows.excellent, time: parseInt(e.target.value) }
                       }
                     }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
                   />
                 </div>
                 <div className="flex-1">
                   <SettingsLabel>Points</SettingsLabel>
                   <input 
                     type="number" 
                     value={gameSettings.scoreWindows.excellent.points}
                     onChange={(e) => setSettings(s => ({
                       ...s, 
                       scoreWindows: {
                         ...s.scoreWindows,
                         excellent: { ...s.scoreWindows.excellent, points: parseInt(e.target.value) }
                       }
                     }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
                   />
                 </div>
               </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
               <h3 className="font-bold mb-3 text-yellow-700">Good Score</h3>
               <div className="flex gap-4">
                 <div className="flex-1">
                   <SettingsLabel>Time (ms)</SettingsLabel>
                   <input 
                     type="number" 
                     value={gameSettings.scoreWindows.good.time}
                     onChange={(e) => setSettings(s => ({
                       ...s, 
                       scoreWindows: {
                         ...s.scoreWindows,
                         good: { ...s.scoreWindows.good, time: parseInt(e.target.value) }
                       }
                     }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
                   />
                 </div>
                 <div className="flex-1">
                   <SettingsLabel>Points</SettingsLabel>
                   <input 
                     type="number" 
                     value={gameSettings.scoreWindows.good.points}
                     onChange={(e) => setSettings(s => ({
                       ...s, 
                       scoreWindows: {
                         ...s.scoreWindows,
                         good: { ...s.scoreWindows.good, points: parseInt(e.target.value) }
                       }
                     }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
                   />
                 </div>
               </div>
            </div>
        </SettingsSection>
      </GameSettingsModal>
    </div>
  );
};

export default VIGIGame;
