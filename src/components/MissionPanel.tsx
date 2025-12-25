import React from 'react';

interface MissionPanelProps {
  instructions: string[];
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ instructions }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wide">Mission</h3>
        <p className="text-blue-700 text-xs mt-0.5">Follow instructions to reach the target</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {instructions.length === 0 ? (
            <div className="text-gray-400 text-sm text-center italic mt-4">No active mission</div>
        ) : (
            <div className="flex flex-col gap-2">
                {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-6">{instruction}</span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
