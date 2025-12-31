import React, { useState, useEffect, useRef } from 'react';
import { Target } from 'lucide-react';
import type { CapacitySettings, CapacityStats } from './types';

// --- VISUAL COMPONENTS ---

// Helper component to render Dice faces
interface DiceProps {
    value: number;
    isReference: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isReference }) => {
  const getDots = (val: number) => {
    switch(val) {
      case 1: return [{top: '50%', left: '50%'}];
      case 2: return [{top: '25%', left: '25%'}, {top: '75%', left: '75%'}];
      case 3: return [{top: '25%', left: '25%'}, {top: '50%', left: '50%'}, {top: '75%', left: '75%'}];
      case 4: return [{top: '25%', left: '25%'}, {top: '25%', left: '75%'}, {top: '75%', left: '25%'}, {top: '75%', left: '75%'}];
      case 5: return [{top: '25%', left: '25%'}, {top: '25%', left: '75%'}, {top: '50%', left: '50%'}, {top: '75%', left: '25%'}, {top: '75%', left: '75%'}];
      case 6: return [{top: '25%', left: '25%'}, {top: '25%', left: '75%'}, {top: '50%', left: '25%'}, {top: '50%', left: '75%'}, {top: '75%', left: '25%'}, {top: '75%', left: '75%'}];
      default: return [];
    }
  };

  return (
    <div style={{
      width: '150px', height: '150px', backgroundColor: '#f8f1e5',
      borderRadius: '20px', border: '2px solid #333', position: 'relative',
      boxShadow: '5px 5px 10px rgba(0,0,0,0.2)', display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}>
      {getDots(value).map((pos, idx) => (
        <div key={idx} style={{
          position: 'absolute', width: '24px', height: '24px', borderRadius: '50%',
          backgroundColor: 'black', transform: 'translate(-50%, -50%)', ...pos
        }}></div>
      ))}
      {isReference && (
        <div style={{ position: 'absolute', bottom: '-40px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            REFERENCE
        </div>
      )}
    </div>
  );
};

// Helper component for Rod Figure
interface RodFigureProps {
    config: boolean[];
}

const RodFigure: React.FC<RodFigureProps> = ({ config }) => {
    // config is array of 12 booleans (true = red, false = gray)
    // Segments: 
    // 0: Top, 1: Bot, 2: TL Vert, 3: TR Vert, 4: BL Vert, 5: BR Vert
    // 6: Mid Left, 7: Mid Right, 8: TL Diag, 9: TR Diag, 10: BL Diag, 11: BR Diag
    
    const getColor = (idx: number) => config[idx] ? '#c0392b' : '#bdc3c7'; // Red : Gray
    
    // SVG Coordinate System: 100x150
    // Stroke width: 8
    
    return (
        <svg width="100" height="150" viewBox="0 0 100 150" style={{ overflow: 'visible' }}>
            {/* 0: Top Horizontal */}
            <line x1="10" y1="5" x2="90" y2="5" stroke={getColor(0)} strokeWidth="8" strokeLinecap="round" />
            {/* 1: Bottom Horizontal */}
            <line x1="10" y1="145" x2="90" y2="145" stroke={getColor(1)} strokeWidth="8" strokeLinecap="round" />
            
            {/* 2: Top Left Vertical */}
            <line x1="5" y1="10" x2="5" y2="70" stroke={getColor(2)} strokeWidth="8" strokeLinecap="round" />
            {/* 3: Top Right Vertical */}
            <line x1="95" y1="10" x2="95" y2="70" stroke={getColor(3)} strokeWidth="8" strokeLinecap="round" />
            
            {/* 4: Bottom Left Vertical */}
            <line x1="5" y1="80" x2="5" y2="140" stroke={getColor(4)} strokeWidth="8" strokeLinecap="round" />
            {/* 5: Bottom Right Vertical */}
            <line x1="95" y1="80" x2="95" y2="140" stroke={getColor(5)} strokeWidth="8" strokeLinecap="round" />
            
            {/* 6: Middle Left Horizontal */}
            <line x1="10" y1="75" x2="45" y2="75" stroke={getColor(6)} strokeWidth="8" strokeLinecap="round" />
            {/* 7: Middle Right Horizontal */}
            <line x1="55" y1="75" x2="90" y2="75" stroke={getColor(7)} strokeWidth="8" strokeLinecap="round" />
            
            {/* 8: Top Left Diagonal (Top-Left to Center) */}
            <line x1="15" y1="15" x2="45" y2="65" stroke={getColor(8)} strokeWidth="8" strokeLinecap="round" />
            {/* 9: Top Right Diagonal */}
            <line x1="85" y1="15" x2="55" y2="65" stroke={getColor(9)} strokeWidth="8" strokeLinecap="round" />
            
            {/* 10: Bot Left Diagonal */}
            <line x1="15" y1="135" x2="45" y2="85" stroke={getColor(10)} strokeWidth="8" strokeLinecap="round" />
            {/* 11: Bot Right Diagonal */}
            <line x1="85" y1="135" x2="55" y2="85" stroke={getColor(11)} strokeWidth="8" strokeLinecap="round" />
        </svg>
    );
};

// --- GAME LOGIC COMPONENTS ---

interface GameLogicProps {
    gameState: string;
    isPaused: boolean;
    settings: CapacitySettings;
    lastSpacePressTime: number;
    onUpdateStats: (stats: Partial<CapacityStats>, reset?: boolean) => void;
}

const DiceGameLogic: React.FC<GameLogicProps> = ({ gameState, isPaused, settings, lastSpacePressTime, onUpdateStats }) => {
  const [referenceDice, setReferenceDice] = useState(1);
  const [currentDice, setCurrentDice] = useState(1);
  const [isDiceVisible, setIsDiceVisible] = useState(false);
  
  const currentDiceRef = useRef(1);
  const referenceDiceRef = useRef(1);
  const hitRegisteredRef = useRef(false);

  const spawnDice = React.useCallback(() => {
    hitRegisteredRef.current = false;
    let val;
    do {
      val = Math.floor(Math.random() * 6) + 1;
    } while (val === currentDiceRef.current);
    
    setCurrentDice(val);
    currentDiceRef.current = val;
    setIsDiceVisible(true);
    
    if (val === referenceDiceRef.current) {
        onUpdateStats({ targets: 1 }); // Increment targets
    }
  }, [onUpdateStats]);

  useEffect(() => {
    if (gameState === 'reference') {
        setTimeout(() => {
            onUpdateStats({ hits: 0, targets: 0 }, true); // Reset
            const ref = Math.floor(Math.random() * 6) + 1;
            setReferenceDice(ref);
            referenceDiceRef.current = ref;
            setCurrentDice(ref);
            setIsDiceVisible(true);
        }, 0);
    }
  }, [gameState, onUpdateStats]);

  useEffect(() => {
    if (gameState !== 'running' || isPaused) return;
    
    // Initial spawn (wrapped in timeout to avoid synchronous state update in effect)
    const timeoutId = setTimeout(() => {
        spawnDice();
    }, 0);
    
    const interval = setInterval(spawnDice, settings.taskChangeSpeed);
    return () => {
        clearTimeout(timeoutId);
        clearInterval(interval);
    };
  }, [gameState, isPaused, settings.taskChangeSpeed, spawnDice]);

  useEffect(() => {
    if (gameState !== 'running' || isPaused) return;
    if (lastSpacePressTime === 0) return;
    
    if (!hitRegisteredRef.current && isDiceVisible) {
        if (currentDiceRef.current === referenceDiceRef.current) {
            onUpdateStats({ hits: 1 }); // Increment hits
            hitRegisteredRef.current = true;
        } else {
            // Wrong hit! Count as fail.
            onUpdateStats({ fails: 1 });
            hitRegisteredRef.current = true; // Prevent multiple fails for same dice
        }
    }
  }, [lastSpacePressTime, isPaused, gameState, isDiceVisible, onUpdateStats]);

  return (
    <Dice 
        value={gameState === 'reference' ? referenceDice : currentDice} 
        isReference={gameState === 'reference'}
    />
  );
};

const RodGameLogic: React.FC<GameLogicProps> = ({ gameState, isPaused, settings, lastSpacePressTime, onUpdateStats }) => {
    const [topConfig, setTopConfig] = useState(Array(12).fill(false));
    const [botConfig, setBotConfig] = useState(Array(12).fill(false));

    const configsRef = useRef<{top: boolean[], bot: boolean[]}>({ top: [], bot: [] });
    const hitRegisteredRef = useRef(false);

    const generateConfig = () => {
        // Random 12 bits
        return Array.from({length: 12}, () => Math.random() > 0.5);
    };

    const spawnPattern = React.useCallback(() => {
        hitRegisteredRef.current = false;
        
        const newTop = generateConfig();
        let newBot;
        
        // 30% chance to be identical
        if (Math.random() < 0.3) {
            newBot = [...newTop];
            onUpdateStats({ targets: 1 }); // It's a match target
        } else {
            newBot = generateConfig();
            // Ensure they are not accidentally identical
            if (JSON.stringify(newTop) === JSON.stringify(newBot)) {
                // Flip one bit to ensure difference
                newBot[0] = !newBot[0];
            }
        }
        
        setTopConfig(newTop);
        setBotConfig(newBot);
        configsRef.current = { top: newTop, bot: newBot };
    }, [onUpdateStats]);

    // Reset stats on mount
    useEffect(() => {
        onUpdateStats({ hits: 0, targets: 0 }, true);
    }, [onUpdateStats]);

    useEffect(() => {
        if (gameState !== 'running' || isPaused) return;
        
        setTimeout(() => spawnPattern(), 0);
        const interval = setInterval(spawnPattern, settings.taskChangeSpeed); 
        return () => clearInterval(interval);
    }, [gameState, isPaused, settings.taskChangeSpeed, spawnPattern]);

    useEffect(() => {
        if (gameState !== 'running' || isPaused) return;
        if (lastSpacePressTime === 0) return;

        if (!hitRegisteredRef.current) {
            const isMatch = JSON.stringify(configsRef.current.top) === JSON.stringify(configsRef.current.bot);
            if (isMatch) {
                onUpdateStats({ hits: 1 });
                hitRegisteredRef.current = true;
            } else {
                onUpdateStats({ fails: 1 });
                hitRegisteredRef.current = true;
            }
        }
    }, [lastSpacePressTime, isPaused, gameState, onUpdateStats]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                <RodFigure config={topConfig} />
                <div style={{ height: '30px' }}></div>
                <RodFigure config={botConfig} />
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface SidePanelProps {
    lastSpacePressTime: number;
    gameState: string;
    gameMode: string | null;
    timeLeft: number;
    flightFails: number;
    totalObstacles: number;
    diceStats: CapacityStats;
    rodStats: CapacityStats;
    currentStats: CapacityStats;
    isPaused: boolean;
    settings: CapacitySettings;
    isFirePressed: boolean;
    onFireStart: () => void;
    onFireEnd: () => void;
    onRestart: () => void;
    onStartGame: () => void;
    onTogglePause: () => void;
    onExitGame: () => void;
    onOpenSettings: () => void;
    onUpdateTaskStats: (stats: Partial<CapacityStats>, reset?: boolean) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ 
    lastSpacePressTime, gameState, gameMode, timeLeft,
    currentStats,
    isPaused, settings, isFirePressed, onFireStart, onFireEnd,
    onUpdateTaskStats 
}) => {
  
  // Pause Overlay
  if (isPaused) {
      return (
          <div style={{ 
              width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
              justifyContent: 'center', alignItems: 'center', gap: '20px',
              backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 10
          }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>PAUSED</h2>
          </div>
      );
  }

  // "Waiting" state is effectively unused in new flow but kept for safety
  if (gameState === 'waiting') {
      return (
          <div style={{ 
              width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
              justifyContent: 'center', alignItems: 'center', gap: '20px' 
          }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>READY?</h2>
          </div>
      );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box',
      color: '#333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '50px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')} MIN</div>
      </div>
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {gameState === 'finished' ? (
             <div style={{ textAlign: 'center', width: '100%', opacity: 0.5 }}>
                 <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>SESSION COMPLETE</h2>
             </div>
        ) : (
            <>
                {gameMode === 'DICE' && (
                    <DiceGameLogic 
                        gameState={gameState} 
                        isPaused={isPaused}
                        settings={settings}
                        lastSpacePressTime={lastSpacePressTime} 
                        onUpdateStats={onUpdateTaskStats} 
                    />
                )}
                {gameMode === 'ROD' && (
                    <RodGameLogic 
                        gameState={gameState} 
                        isPaused={isPaused}
                        settings={settings}
                        lastSpacePressTime={lastSpacePressTime} 
                        onUpdateStats={onUpdateTaskStats} 
                    />
                )}
                
                {gameState === 'running' && (
                    <div style={{ marginTop: '40px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
                        <div>{gameMode} Score: {currentStats.hits} / {currentStats.targets}</div>
                        <div style={{ color: '#d63031', fontSize: '20px' }}>Fail: {currentStats.fails}</div>
                    </div>
                )}

                {/* Fire Button at Bottom of Dice/Rod Section */}
                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <button 
                        className={`capacity-fire-button ${isFirePressed ? 'active' : ''}`}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: isFirePressed ? '#c0392b' : '#e74c3c',
                            border: '4px solid #c0392b',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease',
                            transform: isFirePressed ? 'scale(0.95)' : 'scale(1)',
                            boxShadow: isFirePressed ? 'inset 0 0 10px rgba(0,0,0,0.5)' : '0 4px 8px rgba(0,0,0,0.2)'
                        }}
                        onMouseDown={onFireStart}
                        onMouseUp={onFireEnd}
                        onMouseLeave={onFireEnd}
                        onTouchStart={(e) => { e.preventDefault(); onFireStart(); }}
                        onTouchEnd={(e) => { e.preventDefault(); onFireEnd(); }}
                        title="Fire (Space)"
                    >
                        <Target size={40} color="white" />
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '14px', fontWeight: 'bold', color: '#666' }}>SPACE</div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

 

export default SidePanel;
