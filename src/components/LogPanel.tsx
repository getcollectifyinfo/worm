import React, { useRef, useEffect } from 'react';
import type { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-inner">
      <div className="bg-gray-800 px-4 py-2 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
        System Log
      </div>
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {logs.length === 0 && (
          <div className="text-gray-600 italic">Waiting for input...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="mb-1.5 text-green-400">
            <span className="text-gray-600 text-xs mr-2 select-none">
              {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            </span>
            <span className="font-semibold">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
