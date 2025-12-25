import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Gauge } from './Gauge';

interface IPPGameProps {
  onExit: () => void;
}

interface GameStats {
  correct: number;
  wrong: number;
}

type GaugeId = 'left' | 'top' | 'right';

export const IPPGame: React.FC<IPPGameProps> = ({ onExit }) => {
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [gameOver, setGameOver] = useState(false);
  const [assignments, setAssignments] = useState<{ [key in GaugeId]: string }>({ left: '', top: '', right: '' });
  const [showHint, setShowHint] = useState(false);
  const [stats, setStats] = useState<GameStats>({ correct: 0, wrong: 0 });
  const [gaugeLocks, setGaugeLocks] = useState<{ [key in GaugeId]: boolean }>({ left: false, top: false, right: false });

  // Available keys for assignment
  const availableKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  // Helper to get random keys
  const getRandomKeys = useCallback(() => {
    const shuffled = [...availableKeys].sort(() => 0.5 - Math.random());
    return {
      left: shuffled[0],
      top: shuffled[1],
      right: shuffled[2]
    };
  }, []);

  // Initialize assignments
  useEffect(() => {
    const newAssignments = getRandomKeys();
    setAssignments(newAssignments);
    setShowHint(true);
    const timeout = setTimeout(() => setShowHint(false), 1000); // Show for 1 second

    // Random reassignment loop
    const reassignmentInterval = setInterval(() => {
      if (gameOver) return;
      const nextAssignments = getRandomKeys();
      setAssignments(nextAssignments);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 1000);
    }, 15000 + Math.random() * 15000); // Random interval between 15s and 30s? User said "random zamanlama".

    return () => {
      clearTimeout(timeout);
      clearInterval(reassignmentInterval);
    };
  }, [gameOver, getRandomKeys]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Key Down Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();
      
      let matched = false;
      let wrongPress = false;

      // Check all locked gauges
      (Object.keys(gaugeLocks) as GaugeId[]).forEach(gaugeId => {
        if (gaugeLocks[gaugeId]) {
          // This gauge is in red zone
          if (key === assignments[gaugeId]) {
            // Correct key!
            setGaugeLocks(prev => ({ ...prev, [gaugeId]: false })); // Release lock
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
            matched = true;
          } else {
             // Wrong key for this specific locked gauge?
             // Actually, if I press a key that is NOT assigned to ANY currently locked gauge, is it wrong?
             // Or if I press 'A' (assigned to Left) but Left is not locked?
             // Requirement: "Kullanıcı atanan tuşlardan başka herhangi bir harfe basarsa" -> Show hint.
             // This implies checking if the pressed key matches the requirement of the active red gauge.
          }
        }
      });

      if (!matched) {
          // Did we press a wrong key?
          // If a gauge is locked, and we pressed a key that didn't unlock it, is it wrong?
          // Or is "wrong" only if we press a key that is completely irrelevant?
          // "Kullanıcı atanan tuşlardan başka herhangi bir harfe basarsa" -> If user presses a letter OTHER than the assigned ones?
          // Let's assume: If key is NOT one of the current assignments, OR if it IS an assignment but that gauge is not in red?
          // Let's simplify: Any key press that doesn't successfully unlock a red gauge is considered a "wrong/miss" and triggers hint.
          
          setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
          setShowHint(true);
          setTimeout(() => setShowHint(false), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gaugeLocks, assignments, gameOver]);

  const handleRedZoneEnter = (id: GaugeId) => {
    setGaugeLocks(prev => ({ ...prev, [id]: true }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `0${mins} MIN`; // As per reference "02 MIN"
  };

  return (
    <div className="w-full h-screen bg-[#4a4a4a] flex flex-col items-center justify-center relative p-8">
      {/* Top Left Exit */}
      <div className="absolute top-8 left-8 flex flex-col items-start">
        <div className="text-white text-xl font-bold mb-1">{formatTime(timer)}</div>
        <button 
          onClick={onExit}
          className="bg-black text-white text-4xl font-bold px-8 py-2 border-2 border-white hover:bg-gray-800 transition-colors"
        >
          EXIT
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col items-center gap-16 scale-75 md:scale-100 relative">
        
        {/* Top Center Gauge */}
        <div className="mb-8">
            <Gauge 
                size={300} 
                initialValue={75} 
                isLockedInRed={gaugeLocks.top}
                onRedZoneEnter={() => handleRedZoneEnter('top')}
            />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center gap-16 md:gap-32">
            {/* Left Gauge */}
            <Gauge 
                size={300} 
                initialValue={25} 
                isLockedInRed={gaugeLocks.left}
                onRedZoneEnter={() => handleRedZoneEnter('left')}
            />

            {/* Center Digital Display & Hint */}
            <div className="flex flex-col items-center gap-4">
                <div className="bg-[#2a2a2a] px-16 py-6 border border-gray-600 shadow-inner">
                    <span className="text-[#22c55e] text-6xl font-mono font-bold tracking-widest">
                        70
                    </span>
                </div>
                {/* Hint Text */}
                <div className={`text-yellow-400 font-mono text-xl font-bold transition-opacity duration-300 ${showHint ? 'opacity-100' : 'opacity-0'}`}>
                    LEFT: {assignments.left} , TOP: {assignments.top} , RIGHT: {assignments.right}
                </div>
            </div>

            {/* Right Gauge */}
            <Gauge 
                size={300} 
                initialValue={80} 
                isLockedInRed={gaugeLocks.right}
                onRedZoneEnter={() => handleRedZoneEnter('right')}
            />
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <h2 className="text-white text-6xl font-bold mb-8">GAME OVER</h2>
          <div className="text-white text-2xl mb-4">Correct Presses: <span className="text-green-500">{stats.correct}</span></div>
          <div className="text-white text-2xl mb-8">Wrong Presses: <span className="text-red-500">{stats.wrong}</span></div>
          <button 
            onClick={onExit}
            className="bg-white text-black text-2xl font-bold px-8 py-4 rounded hover:bg-gray-200 transition-colors"
          >
            BACK TO MENU
          </button>
        </div>
      )}
    </div>
  );
};
