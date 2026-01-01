import React, { useMemo, useState } from 'react';
import type { GameSession, GameType } from '../../services/statsService';
import { CockpitGauge } from './CockpitGauge';
import { Calendar, TrendingUp } from 'lucide-react';

interface CockpitDashboardProps {
  stats: GameSession[];
}

const GAME_TYPES: GameType[] = ['WORM', 'IPP', 'VIGI', 'VIGI1', 'CAPACITY', 'CUBE'];

// Estimated max scores for normalization to 0-100
const MAX_SCORES: Record<string, number> = {
  WORM: 20, // Example: 20 levels
  IPP: 100, // Assuming percentage
  VIGI: 100,
  VIGI1: 100,
  CAPACITY: 20, // Items capacity usually low number
  CUBE: 40, // 40 questions
};

export const CockpitDashboard: React.FC<CockpitDashboardProps> = ({ stats }) => {
  const [selectedHistoryGame, setSelectedHistoryGame] = useState<GameType | 'ALL'>('ALL');

  // Calculate current status (Average of last 5 games)
  const currentStatus = useMemo(() => {
    const status: Record<string, number> = {};
    
    GAME_TYPES.forEach(type => {
      const gameStats = stats
        .filter(s => s.game_type === type)
        .sort((a, b) => new Date(b.started_at || 0).getTime() - new Date(a.started_at || 0).getTime())
        .slice(0, 5);

      if (gameStats.length === 0) {
        status[type] = 0;
        return;
      }

      const avgScore = gameStats.reduce((acc, curr) => acc + curr.score, 0) / gameStats.length;
      
      // Normalize to 0-100
      const max = MAX_SCORES[type] || 100;
      let normalized = (avgScore / max) * 100;
      if (normalized > 100) normalized = 100;
      
      status[type] = normalized;
    });

    return status;
  }, [stats]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const filtered = selectedHistoryGame === 'ALL' 
      ? stats 
      : stats.filter(s => s.game_type === selectedHistoryGame);
    
    // Sort by date ascending
    const sorted = [...filtered].sort((a, b) => new Date(a.started_at || 0).getTime() - new Date(b.started_at || 0).getTime());
    
    if (sorted.length === 0) return [];

    // Normalize scores for chart
    return sorted.map(s => {
      const max = MAX_SCORES[s.game_type] || 100;
      let val = (s.score / max) * 100;
      if (val > 100) val = 100;
      return {
        date: new Date(s.started_at || 0),
        value: val,
        type: s.game_type
      };
    });
  }, [stats, selectedHistoryGame]);

  // Simple SVG Line Chart
  const renderChart = () => {
    if (chartData.length < 2) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500 bg-black/20 rounded-xl border border-gray-700">
          Not enough data to display history
        </div>
      );
    }

    const width = 800;
    const height = 300;
    const padding = 40;
    
    const minDate = chartData[0].date.getTime();
    const maxDate = chartData[chartData.length - 1].date.getTime();
    const dateRange = maxDate - minDate || 1;

    const points = chartData.map(d => {
      const x = padding + ((d.date.getTime() - minDate) / dateRange) * (width - 2 * padding);
      const y = height - padding - (d.value / 100) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full overflow-x-auto bg-black/40 p-4 rounded-xl border border-gray-700">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible min-w-[600px]">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(val => {
             const y = height - padding - (val / 100) * (height - 2 * padding);
             return (
               <g key={val}>
                 <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#374151" strokeDasharray="4" />
                 <text x={padding - 10} y={y + 4} textAnchor="end" className="fill-gray-500 text-xs">{val}</text>
               </g>
             );
          })}

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#10b981" // Green-500
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {chartData.map((d, i) => {
             const x = padding + ((d.date.getTime() - minDate) / dateRange) * (width - 2 * padding);
             const y = height - padding - (d.value / 100) * (height - 2 * padding);
             return (
               <circle key={i} cx={x} cy={y} r="4" fill="#10b981" stroke="#064e3b" strokeWidth="2" />
             );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Gauges Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {GAME_TYPES.map(type => (
          <div key={type} className="flex flex-col items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-gray-500 transition-colors">
            {/* Screw heads for cockpit look */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-600 border border-gray-900 shadow-inner" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-600 border border-gray-900 shadow-inner" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-600 border border-gray-900 shadow-inner" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-600 border border-gray-900 shadow-inner" />

            <CockpitGauge 
              value={currentStatus[type]} 
              label={type} 
              size={220} 
            />
            
            {/* Status Light */}
            <div className="mt-4 flex items-center gap-2">
               <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${currentStatus[type] > 70 ? 'bg-green-500 shadow-green-500' : currentStatus[type] > 40 ? 'bg-yellow-500 shadow-yellow-500' : 'bg-red-500 shadow-red-500'}`} />
               <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">SYS STATUS</span>
            </div>
          </div>
        ))}
      </div>

      {/* History Chart Section */}
      <div className="bg-gray-800/80 p-8 rounded-3xl border border-gray-700 shadow-2xl backdrop-blur-sm">
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="text-blue-500" />
              Flight Data Recorder
            </h2>
            
            <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
               <button
                  onClick={() => setSelectedHistoryGame('ALL')}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${selectedHistoryGame === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
               >
                 ALL
               </button>
               {GAME_TYPES.map(type => (
                 <button
                    key={type}
                    onClick={() => setSelectedHistoryGame(type)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${selectedHistoryGame === type ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                 >
                   {type}
                 </button>
               ))}
            </div>
         </div>
         
         {renderChart()}
         
         <div className="mt-4 flex justify-end text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-2">
               <Calendar size={12} />
               <span>TIMELINE VIEW</span>
            </div>
         </div>
      </div>
    </div>
  );
};
