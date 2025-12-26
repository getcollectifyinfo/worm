import React, { useState } from 'react';
import { Eye, Music } from 'lucide-react';
import { AnalogGauge } from './AnalogGauge';
import { DigitalDisplay } from './DigitalDisplay';
import { useVIGI1GameLogic } from './useVIGI1GameLogic';
import { GameStartMenu } from '../GameStartMenu';
import { GameTutorial } from '../GameTutorial';
import { GameSettingsModal, SettingsSection, SettingsLabel, SettingsRange } from '../GameSettingsModal';

interface VIGI1GameProps {
  onExit: () => void;
}

const VIGI1Game: React.FC<VIGI1GameProps> = ({ onExit }) => {
  const { gameState, actions } = useVIGI1GameLogic();
  const { 
      isPlaying, 
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
      wrongAudio 
  } = gameState;
  const { startGame, handleEyeClick, handleNoteClick, setGameDuration } = actions;
  
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-screen bg-gray-200 flex flex-col items-center justify-center font-sans select-none">
      
      {/* Top Bar / HUD */}
      <div className="absolute top-4 w-full flex justify-between px-8 text-gray-800">
         <div className="flex gap-4">
             <div className="bg-white px-4 py-2 rounded shadow">
                 <span className="font-bold">SCORE:</span> {score}
             </div>
             <div className="bg-white px-4 py-2 rounded shadow">
                 <span className="font-bold">TIME:</span> {formatTime(gameTime)}
             </div>
         </div>
         <div>
             <button onClick={onExit} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">
                 EXIT
             </button>
         </div>
      </div>

      {/* Main Game Area */}
      <div className="relative">
         <AnalogGauge value={analogValue} size={400} />
         <DigitalDisplay value={digitalValue} />
      </div>

      {/* Controls */}
      <div className="flex gap-16 mt-12">
        {/* Note Button */}
        <button 
          className="w-24 h-24 bg-white rounded-xl shadow-lg border-2 border-gray-300 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
          onClick={handleNoteClick}
        >
          <Music size={48} className="text-blue-500" />
        </button>

        {/* Eye Button */}
        <button 
          className="w-24 h-24 bg-white rounded-xl shadow-lg border-2 border-gray-300 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
          onClick={handleEyeClick}
        >
          <Eye size={48} className="text-orange-500" />
        </button>
      </div>

      {/* Tutorial Overlay */}
      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="VIGI 1 (Audio-Visual Vigilance)"
        description="Monitor the gauge and digital display for discrepancies."
        rules={[
          "The analog needle moves randomly (Clockwise/Counter-clockwise).",
          "The digital display should show: Analog Value × 10 (e.g., 3 -> 030).",
          "MISMATCH EXAMPLE: Needle moves to 6, but Digital shows 50 (stuck on previous value).",
          "If the values DO NOT match, press the EYE button immediately.",
          "AUDIO CHALLENGE: Listen to the tones (High, Medium, Low).",
          "If you hear the SAME TONE 3 times in a row, press the NOTE button.",
          "Be quick! You must press before the next tone plays."
        ]}
        controls={[
          { key: "EYE Button", action: "Report Visual Mismatch", icon: <Eye /> },
          { key: "NOTE Button", action: "Report 3 Consecutive Tones", icon: <Music /> }
        ]}
      />

      {/* Start Menu Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <GameStartMenu 
                title="VIGI 1"
                startLabel={gameTime > 0 ? "PLAY AGAIN" : "START GAME"}
                onStart={startGame}
                onSettings={() => setIsSettingsOpen(true)}
                onBack={onExit}
                highScore={0} // TODO: Persist high score
                onTutorial={() => setIsTutorialOpen(true)}
            >
                {gameTime > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4 w-full">
                        <div className="col-span-2 bg-gray-700 p-3 rounded-lg text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Total Score</div>
                            <div className="text-3xl font-bold text-yellow-400">{score}</div>
                        </div>

                        {/* Visual Stats */}
                        <div className="bg-gray-700 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Visual Accuracy</div>
                            <div className="text-xl font-bold text-green-400">
                                {totalEvents > 0 ? Math.round((caughtEvents / totalEvents) * 100) : 0}%
                            </div>
                        </div>
                         <div className="bg-gray-700 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Visual Caught</div>
                            <div className="text-lg font-bold text-white">{caughtEvents} / {totalEvents}</div>
                        </div>

                        {/* Audio Stats */}
                        <div className="bg-gray-700 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Audio Accuracy</div>
                            <div className="text-xl font-bold text-blue-400">
                                {audioEvents > 0 ? Math.round((caughtAudio / audioEvents) * 100) : 0}%
                            </div>
                        </div>
                        <div className="bg-gray-700 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Audio Caught</div>
                            <div className="text-lg font-bold text-white">{caughtAudio} / {audioEvents}</div>
                        </div>

                        <div className="col-span-2 bg-gray-700 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Total False Alarms</div>
                            <div className="text-lg font-bold text-red-400">{wrongMoves + wrongAudio}</div>
                        </div>
                    </div>
                )}
            </GameStartMenu>
        </div>
      )}

      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="VIGI 1 Settings"
      >
        <SettingsSection title="Game Duration">
            <SettingsLabel>Duration (Minutes)</SettingsLabel>
            <SettingsRange 
                value={gameDuration / 60}
                min={1}
                max={10}
                step={1}
                onChange={(val) => setGameDuration(val * 60)}
                leftLabel="1 min"
                rightLabel="10 min"
                valueLabel={`${gameDuration / 60} min`}
            />
        </SettingsSection>
      </GameSettingsModal>

    </div>
  );
};

export default VIGI1Game;
