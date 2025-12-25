import React from 'react';

interface SnakeProps {
  rotation: number;
}

export const Snake: React.FC<SnakeProps> = ({ rotation }) => {
  return (
    <div
      className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-in-out"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Body extending up from center */}
        {/* We use bottom-1/2 to place the bottom of the line at the vertical center */}
        {/* We slightly overlap the tail so it looks connected */}
        <div className="absolute w-1.5 h-[80%] bg-green-500 bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom rounded-t-full" />
        
        {/* Tail at center */}
        <div className="absolute w-3 h-3 bg-green-500 rounded-full z-10" />
      </div>
    </div>
  );
};
