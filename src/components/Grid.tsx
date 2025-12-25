import React from 'react';
import { GRID_SIZE } from '../types';
import type { Position } from '../types';
import { Snake } from './Snake';

interface GridProps {
  snakePosition: Position;
  snakeRotation: number;
  targetPosition?: Position;
}

export const Grid: React.FC<GridProps> = ({ snakePosition, snakeRotation, targetPosition }) => {
  // We want to render a grid of lines.
  // For 8x8 positions (0..7), we need 8 vertical and 8 horizontal lines.
  // These lines form 7x7 squares visually.
  
  const verticalLines = Array.from({ length: GRID_SIZE }, (_, i) => (
    <div
      key={`v-${i}`}
      className="absolute top-0 bottom-0 w-px bg-gray-300"
      style={{ left: `${(i / (GRID_SIZE - 1)) * 100}%` }}
    />
  ));

  const horizontalLines = Array.from({ length: GRID_SIZE }, (_, i) => (
    <div
      key={`h-${i}`}
      className="absolute left-0 right-0 h-px bg-gray-300"
      style={{ top: `${(i / (GRID_SIZE - 1)) * 100}%` }}
    />
  ));

  return (
    <div className="relative w-full h-full aspect-square border-2 border-black bg-white shadow-lg mx-auto p-4 md:p-8 box-border">
      <div className="relative w-full h-full">
        {/* Grid Lines */}
        {verticalLines}
        {horizontalLines}

        {/* Target Layer */}
        {targetPosition && (
          <div
            className="absolute w-6 h-6 bg-red-500 rounded-full shadow-md z-10"
            style={{
              left: `${(targetPosition.x / (GRID_SIZE - 1)) * 100}%`,
              top: `${(targetPosition.y / (GRID_SIZE - 1)) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Snake Layer */}
        <div
          className="absolute w-12 h-12 flex items-center justify-center transition-all duration-300 ease-in-out"
          style={{
            left: `${(snakePosition.x / (GRID_SIZE - 1)) * 100}%`,
            top: `${(snakePosition.y / (GRID_SIZE - 1)) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
           <Snake rotation={snakeRotation} />
        </div>
      </div>
    </div>
  );
};
