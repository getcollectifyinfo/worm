import React, { useEffect, useState } from 'react';
import { Gauge } from './Gauge';

interface IPPGameProps {
  onExit: () => void;
}

export const IPPGame: React.FC<IPPGameProps> = ({ onExit }) => {
  const [timer, setTimer] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    // const secs = seconds % 60;
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
      <div className="flex flex-col items-center gap-16 scale-75 md:scale-100">
        
        {/* Top Center Gauge */}
        <div className="mb-8">
            <Gauge size={300} initialValue={75} />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center gap-16 md:gap-32">
            {/* Left Gauge */}
            <Gauge size={300} initialValue={25} />

            {/* Center Digital Display */}
            <div className="bg-[#2a2a2a] px-16 py-6 border border-gray-600 shadow-inner">
                <span className="text-[#22c55e] text-6xl font-mono font-bold tracking-widest">
                    70
                </span>
            </div>

            {/* Right Gauge */}
            <Gauge size={300} initialValue={80} />
        </div>
      </div>
    </div>
  );
};
