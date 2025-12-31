import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Music, HelpCircle, Settings, LogOut, Play, Pause } from 'lucide-react';
import { AnalogGauge } from './AnalogGauge';
import { DigitalDisplay } from './DigitalDisplay';
import { useVIGI1GameLogic } from './useVIGI1GameLogic';
import { GameStartMenu } from '../GameStartMenu';
import { GameTutorial } from '../GameTutorial';
import { GameSettingsModal, SettingsSection, SettingsLabel, SettingsRange } from '../GameSettingsModal';
import { statsService } from '../../services/statsService';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';
import { SmartLoginGate } from '../Auth/SmartLoginGate';
import { MiniExamEndModal } from '../MiniExamEndModal';
import { GameResultsModal } from '../GameResultsModal';
import { toast, Toaster } from 'react-hot-toast';

interface VIGI1GameProps {
  onExit: () => void;
}

const VIGI1Game: React.FC<VIGI1GameProps> = ({ onExit }) => {
  const { gameState, actions } = useVIGI1GameLogic();
  const { 
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
      audioDifficulty
  } = gameState;
  const { 
      startGame, 
      handleEyeClick, 
      handleNoteClick, 
      setGameDuration, 
      setAudioDifficulty,
      pauseGame,
      togglePause
  } = actions;

  const { 
    checkAccess, 
    tier, 
    showProModal, 
    closeProModal, 
    openProModal, 
    handleUpgrade, 
    showLoginGate, 
    closeLoginGate, 
    openLoginGate 
  } = useGameAccess();
  
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showMiniExamModal, setShowMiniExamModal] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Auto-end game logic needs to be handled.
  // The hook useVIGI1GameLogic seems to handle timer?
  // Let's check if it stops automatically. 
  // If not, we might need a useEffect here.
  // Assuming the hook stops the game when time is up.

  // But we need to detect when game ends to show modals.
  // We can track isPlaying change from true to false?
  // Or maybe the hook exposes a "gameFinished" state?
  // Let's look at useVIGI1GameLogic later if needed.
  // For now, I'll assume we need to trigger finish manually or detect it.

  // Actually, VIGI1 usually runs on a timer.
  // If useVIGI1GameLogic doesn't expose "finished", we might need to rely on isPlaying flipping.
  
  // Let's create a wrapper for startGame and stopGame (if exposed).
  
  const handleStartGame = () => {
    if (!checkAccess('vigi1')) return;
    
    // Guest/Free Restrictions
    if (tier !== 'PRO') {
        setGameDuration(120); // 2 minutes
        setAudioDifficulty(1); // Easy
    }
    
    startGame();
  };

  // Detect Game Over
  // We need to know when the game finishes naturally.
  // If the hook manages the timer and sets isPlaying to false when done.
  const prevIsPlayingRef = useRef(false);

  const handleEndGame = useCallback(async () => {
    // Save stats
    if (tier !== 'GUEST') {
        await statsService.saveSession({
            game_type: 'VIGI1',
            score: score,
            duration_seconds: gameDuration - gameTime, // Approximate if gameTime counts down?
            // Wait, gameTime in VIGI1 usually counts UP or DOWN?
            // In the display it shows "TIME: formatTime(gameTime)".
            // If it counts down, duration is total - remaining.
            // If it counts up, duration is gameTime.
            // Let's assume it counts down from gameDuration.
            metadata: {
                total_events: totalEvents,
                caught_events: caughtEvents,
                wrong_moves: wrongMoves,
                audio_events: audioEvents,
                caught_audio: caughtAudio,
                wrong_audio: wrongAudio
            }
        });
    }

    if (tier !== 'PRO') {
        setShowMiniExamModal(true);
    } else {
        setShowResults(true);
    }
  }, [tier, score, gameDuration, gameTime, totalEvents, caughtEvents, wrongMoves, audioEvents, caughtAudio, wrongAudio]);

  useEffect(() => {
    const prev = prevIsPlayingRef.current;
    if (isPlaying) {
        prevIsPlayingRef.current = true;
    } else if (prev) {
        prevIsPlayingRef.current = false;
        setTimeout(() => handleEndGame(), 0);
    }
  }, [isPlaying, handleEndGame]);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-screen bg-gray-200 flex flex-col items-center justify-center font-sans select-none">
      <Toaster position="top-center" />
      <ProAccessModal isOpen={showProModal} onClose={closeProModal} onUpgrade={handleUpgrade} />
      <SmartLoginGate
        isOpen={showLoginGate}
        onClose={() => {
            closeLoginGate();
            toast('Giriş yapmalısın.', { icon: '🔒' });
        }}
        onLoginSuccess={() => {
            closeLoginGate();
            const pending = localStorage.getItem('pending_pro_upgrade');
            if (pending) {
                localStorage.removeItem('pending_pro_upgrade');
                handleUpgrade('vigi1-login');
            } else {
                handleStartGame();
            }
        }}
      />
      
      {/* Top Left Stats */}
      {isPlaying && (
      <div className="absolute top-4 left-4 flex gap-4 text-gray-800 z-[1000]">
         <div className="bg-white px-4 py-2 rounded shadow">
             <span className="font-bold">SCORE:</span> {score}
         </div>
         <div className="bg-white px-4 py-2 rounded shadow">
             <span className="font-bold">TIME:</span> {formatTime(gameTime)}
         </div>
      </div>
      )}

      {/* Top Right Standard Menu */}
      {isPlaying && (
      <div className="absolute top-4 right-4 z-[2000] flex flex-col gap-3">
            {/* Tutorial */}
            <button 
              onClick={() => {
                  if (isPlaying && !isPaused) pauseGame();
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
                  if (isPlaying && !isPaused) pauseGame();
                  setIsSettingsOpen(true);
              }}
              className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 group relative border border-slate-700 text-white"
              title="Settings"
            >
               <Settings size={24} />
            </button>

            {/* Pause/Resume - Only when playing */}
            {isPlaying && (
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

      {/* Main Game Area */}
      <div className="relative">
         <AnalogGauge value={analogValue} size={400} />
         <DigitalDisplay value={digitalValue} />
      </div>

      {/* Controls */}
      {isPlaying && (
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
      )}

      {/* Tutorial Overlay */}
      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        initialLocale="tr"
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
        translations={{
          tr: {
            title: "VIGI 1 (Görsel-İşitsel Uyanıklık)",
            description: "İbreyi ve dijital ekranı uyuşmazlık için izle.",
            rules: [
              "Analog ibre rastgele hareket eder (Saat yönü / ters yönde).",
              "Dijital ekranda: Analog Değer × 10 gösterilmelidir (ör. 3 -> 030).",
              "UYUŞMAZLIK ÖRNEĞİ: İbre 6’ya gelir, dijital 50 gösterir (önceki değerde takılı).",
              "Değerler UYUŞMAZSA hemen GÖZ butonuna bas.",
              "İŞİTSEL GÖREV: Tonları dinle (Yüksek, Orta, Düşük).",
              "Aynı ton art arda 3 kez çalarsa NOTA butonuna bas.",
              "Hızlı ol! Sonraki ton çalmadan basmalısın."
            ],
            controls: [
              { key: "GÖZ", action: "Görsel Uyuşmazlık Bildir", icon: <Eye /> },
              { key: "NOTA", action: "3 Ardışık Tonu Bildir", icon: <Music /> }
            ],
            ctaText: "Tamam"
          }
        }}
      />

      {/* Start Menu Overlay */}
      {!isPlaying && !showResults && !showMiniExamModal && (
        <GameStartMenu 
            title="VIGI 1"
            startLabel={score > 0 ? "PLAY AGAIN" : "EXAM MODE"}
            onStart={handleStartGame}
            onSettings={() => setIsSettingsOpen(true)}
            onPractice={() => setIsSettingsOpen(true)}
            onLearn={() => setIsTutorialOpen(true)}
            onBack={onExit}
            tier={tier}
        />
      )}

      <MiniExamEndModal
        isOpen={showMiniExamModal}
        onClose={() => setShowMiniExamModal(false)}
        onUpgrade={() => {
            setShowMiniExamModal(false);
            if (tier === 'GUEST') {
                localStorage.setItem('pending_pro_upgrade', 'true');
                openLoginGate();
            } else {
                handleUpgrade('vigi1-end');
            }
        }}
        onPractice={() => {
             setShowMiniExamModal(false);
             setIsSettingsOpen(true);
        }}
      />

      <GameResultsModal
        isOpen={showResults}
        score={score}
        duration={formatTime(gameDuration)} // Assuming gameDuration is the full time
        tier={tier}
        onRetry={() => {
            setShowResults(false);
            handleStartGame();
        }}
        onExit={onExit}
      >
        <div className="grid grid-cols-2 gap-3 mb-4 w-full">
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Visual Accuracy</div>
                <div className="text-xl font-bold text-green-400">
                    {totalEvents > 0 ? Math.round((caughtEvents / totalEvents) * 100) : 0}%
                </div>
            </div>
             <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Visual Caught</div>
                <div className="text-lg font-bold text-white">{caughtEvents} / {totalEvents}</div>
            </div>

            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Audio Accuracy</div>
                <div className="text-xl font-bold text-blue-400">
                    {audioEvents > 0 ? Math.round((caughtAudio / audioEvents) * 100) : 0}%
                </div>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Audio Caught</div>
                <div className="text-lg font-bold text-white">{caughtAudio} / {audioEvents}</div>
            </div>

            <div className="col-span-2 bg-gray-800 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Total False Alarms</div>
                <div className="text-lg font-bold text-red-400">{wrongMoves + wrongAudio}</div>
            </div>
        </div>
      </GameResultsModal>

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
                        valueLabel={<>Duration: <span className="text-purple-600 font-bold">{gameDuration / 60} min</span></>}
                        isLocked={tier !== 'PRO'}
                        onLockedClick={openProModal}
                    />
                </SettingsSection>
                
                <SettingsSection title="Audio Challenge">
                    <SettingsLabel>Same Tone Frequency</SettingsLabel>
                    <SettingsRange 
                        value={audioDifficulty}
                        min={1}
                        max={10}
                        step={1}
                        onChange={setAudioDifficulty}
                        leftLabel="Low"
                        rightLabel="High"
                        valueLabel={<>Difficulty: <span className="text-purple-600 font-bold">{audioDifficulty}</span></>}
                        isLocked={tier !== 'PRO'}
                        onLockedClick={openProModal}
                    />
                </SettingsSection>
            </GameSettingsModal>

    </div>
  );
};

export default VIGI1Game;
