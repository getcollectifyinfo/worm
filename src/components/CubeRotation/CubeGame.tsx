import React, { useState, useEffect } from 'react';
import { useCubeGameLogic } from './useCubeGameLogic';
import type { CubePosition } from './useCubeGameLogic';
import { ArrowLeft, Play, Settings, HelpCircle } from 'lucide-react';
import { GameTutorial } from '../GameTutorial';
import { GameSettingsModal, SettingsSection, SettingsLabel, SettingsRange } from '../GameSettingsModal';
import { GameStartMenu } from '../GameStartMenu';
import { useGameAccess } from '../../hooks/useGameAccess';
import { ProAccessModal } from '../ProAccessModal';

interface CubeGameProps {
  onExit: () => void;
}

export const CubeGame: React.FC<CubeGameProps> = ({ onExit }) => {
  const {
    tier,
    checkAccess,
    showProModal,
    closeProModal,
    openProModal,
    maxDuration,
    handleUpgrade
  } = useGameAccess();

  const {
    phase,
    targetLabel,
    currentCommand,
    userAnswer,
    correctAnswer,
    score,
    round,
    commandSpeed,
    commandCount,
    setCommandSpeed,
    setCommandCount,
    startGame,
    handleAnswer,
    nextRound
  } = useCubeGameLogic();

  const [hasStarted, setHasStarted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [proModalVariant, setProModalVariant] = useState<'default' | 'exam-settings'>('default');

  const handleStartGame = () => {
    if (!checkAccess('cube')) return;
    if (tier === 'GUEST') {
      setCommandCount(3);
    }
    setHasStarted(true);
    startGame();
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleLockedClick = () => {
    setProModalVariant('exam-settings');
    openProModal();
  };

  const handleCloseProModal = () => {
    closeProModal();
    setProModalVariant('default');
  };

  useEffect(() => {
    if (hasStarted && maxDuration > 0) {
      const timer = setTimeout(() => {
        setHasStarted(false);
        setProModalVariant('default');
        openProModal();
      }, maxDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, maxDuration, openProModal]);

  const renderCommand = () => {
    if (!currentCommand) return null;
    
    return (
      <div className="flex flex-col items-center justify-center animate-in zoom-in duration-300">
        <span className="text-7xl font-black text-white tracking-widest">{currentCommand}</span>
      </div>
    );
  };

  const renderOptions = () => {
    const positions: CubePosition[] = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT', 'FRONT', 'BACK'];
    
    return (
      <div className="grid grid-cols-3 gap-4 max-w-2xl w-full">
        {positions.map(pos => {
          let btnClass = "h-24 rounded-xl text-xl font-bold transition-all duration-200 border-4 ";
          
          if (phase === 'FEEDBACK') {
            if (pos === correctAnswer) {
              btnClass += "bg-green-600 border-green-400 text-white";
            } else if (pos === userAnswer) {
              btnClass += "bg-red-600 border-red-400 text-white";
            } else {
              btnClass += "bg-gray-700 border-gray-600 text-gray-400 opacity-50";
            }
          } else {
            btnClass += "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-blue-500 hover:scale-105";
          }

          return (
            <button
              key={pos}
              onClick={() => handleAnswer(pos)}
              disabled={phase !== 'WAITING_ANSWER'}
              className={btnClass}
            >
              {pos}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-[#1a1a1a] flex flex-col items-center p-8 relative">
      {showProModal && (
        <ProAccessModal 
          isOpen={showProModal} 
          onClose={handleCloseProModal}
          onUpgrade={handleUpgrade}
          variant={proModalVariant}
          title={proModalVariant === 'exam-settings' ? "Gerçek Sınav Ayarları" : undefined}
          description={proModalVariant === 'exam-settings' ? "Orta ve zor seviye ayarlar, zaman baskısı ve görev yoğunluğu açısından gerçek sınav koşullarına en yakın yapılandırmadır. Bu ayarlar yalnızca Pro üyelikte açılır." : undefined}
          ctaText={proModalVariant === 'exam-settings' ? "Pro’ya Geç – Gerçek Sınav Modu" : undefined}
          trustText={proModalVariant === 'exam-settings' ? "İstediğin zaman iptal edebilirsin." : undefined}
        />
      )}

      <GameTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="CUBE ROTATION"
        description="Follow the face of the cube as it rotates in 3D space. Keep track of where your target face ends up! This test measures your spatial orientation and working memory."
        rules={[
          "You will be assigned a target face (e.g., FRONT, TOP).",
          "Watch the sequence of rotation commands (LEFT, RIGHT, FRONT, BACK).",
          "Visualize the cube rotating in your mind based on the commands.",
          "After the sequence, select the final position of your target face.",
          "Orientation is reset at the start of each round (FRONT=FRONT, TOP=TOP, etc.)."
        ]}
        controls={[]}
      />

      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Game Settings"
        onInfoClick={() => alert("Ayarlar, gerçek sınav koşullarına göre test zorluğunu ve süreyi değiştirir.")}
      >
        <SettingsSection title="Difficulty">
            <SettingsLabel>Number of Commands: {commandCount}</SettingsLabel>
            <SettingsRange 
                value={commandCount} 
                min={3} 
                max={15} 
                step={1} 
                onChange={setCommandCount}
                leftLabel="Easy (Mini deneme – 2 dk)"
                rightLabel="Hard (15)"
                isLocked={tier !== 'PRO'}
                onLockedClick={handleLockedClick}
            />
        </SettingsSection>
        
        <SettingsSection title="Speed">
            <SettingsLabel>Command Duration: {commandSpeed}ms</SettingsLabel>
            <SettingsRange 
                value={commandSpeed} 
                min={500} 
                max={3000} 
                step={100} 
                onChange={setCommandSpeed}
                leftLabel="Fast (500ms)"
                rightLabel="Slow (3000ms)"
                isLocked={tier !== 'PRO'}
                onLockedClick={handleLockedClick}
            />
        </SettingsSection>
      </GameSettingsModal>

      {!hasStarted ? (
        <GameStartMenu
          title="CUBE ROTATION"
          onStart={handleStartGame}
          onSettings={handleOpenSettings}
          onBack={onExit}
          onTutorial={() => setIsTutorialOpen(true)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-12">
            <button 
              onClick={onExit}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Exit</span>
            </button>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-400">ROUND</div>
                <div className="text-2xl font-bold text-white">{round}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">SCORE</div>
                <div className="text-2xl font-bold text-green-400">{score}</div>
              </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => setIsTutorialOpen(true)}
                    className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="How to Play"
                >
                    <HelpCircle size={24} />
                </button>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="Settings"
                >
                    <Settings size={24} />
                </button>
            </div>
          </div>

          {/* Game Content */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">
            
            {phase === 'SHOWING_TARGET' && (
              <div className="text-center animate-in fade-in duration-500">
                <h2 className="text-3xl text-gray-300 mb-6">Follow the face:</h2>
                <div className="text-8xl font-black text-blue-500 tracking-wider">
                  {targetLabel}
                </div>
              </div>
            )}

            {phase === 'SHOWING_COMMANDS' && (
              <div className="flex items-center justify-center h-64 w-full">
                {renderCommand()}
              </div>
            )}

            {(phase === 'WAITING_ANSWER' || phase === 'FEEDBACK') && (
              <div className="flex flex-col items-center gap-8 w-full animate-in slide-in-from-bottom-10 duration-500">
                {renderOptions()}
                
                {phase === 'FEEDBACK' && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    <div className={`text-2xl font-bold ${userAnswer === correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                      {userAnswer === correctAnswer ? 'CORRECT!' : 'WRONG!'}
                    </div>
                    <button
                      onClick={nextRound}
                      className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all transform hover:scale-105 font-bold text-xl shadow-lg shadow-blue-900/50"
                    >
                      <Play size={24} />
                      Next Round
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
          
          {/* Instructions Footer */}
        </>
      )}
    </div>
  );
};
