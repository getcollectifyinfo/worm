import React, { useEffect, useRef } from 'react';
import type { MissionStep } from '../types';

interface MissionPanelProps {
  instructions: MissionStep[];
  currentStepIndex: number;
  isError: boolean;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ instructions, currentStepIndex, isError }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        // Find the active element and scroll to it
        const activeElement = scrollRef.current.children[currentStepIndex] as HTMLElement;
        if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
  }, [currentStepIndex]);

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
            <div ref={scrollRef} className="flex flex-col gap-2">
                {instructions.map((step, index) => {
                    let statusClass = "bg-gray-50 border-gray-100 text-gray-700"; // Pending
                    let numberClass = "bg-blue-100 text-blue-600";
                    let icon = null;

                    if (index < currentStepIndex) {
                        // Completed
                        statusClass = "bg-green-50 border-green-200 text-green-800";
                        numberClass = "bg-green-200 text-green-700";
                        icon = (
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        );
                    } else if (index === currentStepIndex) {
                        // Active
                        if (isError) {
                            statusClass = "bg-red-50 border-red-200 text-red-800 animate-pulse";
                            numberClass = "bg-red-200 text-red-700";
                        } else {
                            statusClass = "bg-blue-50 border-blue-200 text-blue-800 ring-2 ring-blue-100";
                            numberClass = "bg-blue-200 text-blue-700";
                        }
                    }

                    return (
                        <div key={step.id} className={`flex items-start gap-3 p-2 rounded-lg border transition-all duration-300 ${statusClass}`}>
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${numberClass}`}>
                                {icon ? icon : index + 1}
                            </div>
                            <span className="text-sm font-medium leading-6 flex-1">{step.text}</span>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};
