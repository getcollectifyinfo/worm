import React from 'react';
import clsx from 'clsx';
import { ArrowLeft, ArrowDown, ArrowRight } from 'lucide-react';

interface ControlsProps {
  pressedKey: string | null;
}

export const Controls: React.FC<ControlsProps> = ({ pressedKey }) => {
  const getKeyClass = (key: string) => clsx(
    "w-12 h-12 flex items-center justify-center border-2 rounded-lg transition-all duration-150 shadow-sm",
    pressedKey === key 
      ? "bg-blue-500 text-white border-blue-600 scale-95 shadow-inner" 
      : "bg-white border-gray-200 text-gray-600"
  );

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      <div className="text-sm font-medium text-gray-500 mb-1">CONTROLS</div>
      
      <div className="flex gap-2">
        <div className={getKeyClass('ArrowLeft')}>
          <ArrowLeft size={24} />
        </div>
        <div className={getKeyClass('ArrowDown')}>
          <ArrowDown size={24} />
        </div>
        <div className={getKeyClass('ArrowRight')}>
          <ArrowRight size={24} />
        </div>
      </div>
      
      <div className={clsx(
         "w-full h-12 flex items-center justify-center border-2 rounded-lg transition-all duration-150 shadow-sm",
         pressedKey === ' ' 
           ? "bg-blue-500 text-white border-blue-600 scale-95 shadow-inner" 
           : "bg-white border-gray-200 text-gray-600"
       )}>
         <span className="font-bold text-sm tracking-wider">SPACE</span>
       </div>
    </div>
  );
};
