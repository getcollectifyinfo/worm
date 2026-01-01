import React, { useEffect, useState } from 'react';
import { statsService } from '../services/statsService';
import type { GameSession, GameType } from '../services/statsService';
import { Loader2, ArrowLeft, Trophy, Clock, Calendar } from 'lucide-react';

interface StatisticsPageProps {
  onBack: () => void;
}

export const StatisticsPage: React.FC<StatisticsPageProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GameSession[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameType | 'ALL'>('ALL');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await statsService.getUserStats();
        if (data) {
            // Sort by date desc
            setStats(data.sort((a: GameSession, b: GameSession) => {
                const dateA = a.started_at ? new Date(a.started_at).getTime() : 0;
                const dateB = b.started_at ? new Date(b.started_at).getTime() : 0;
                return dateB - dateA;
            }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const filteredStats = selectedGame === 'ALL' ? stats : stats.filter(s => s.game_type === selectedGame);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Menu</span>
        </button>

        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Trophy className="text-yellow-500" />
          Your Performance Statistics
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {(['ALL', 'WORM', 'IPP', 'VIGI1', 'VIGI', 'CAPACITY'] as const).map(type => (
                <button
                    key={type}
                    onClick={() => setSelectedGame(type)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                        selectedGame === type 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    {type === 'ALL' ? 'All Games' : type}
                </button>
            ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-500" size={48} />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredStats.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-800/50 rounded-2xl">
                    No game sessions found. Start playing to track your progress!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStats.map((session, idx) => (
                        <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded text-xs font-bold ${
                                    session.game_type === 'WORM' ? 'bg-green-900 text-green-300' :
                                    session.game_type === 'IPP' ? 'bg-blue-900 text-blue-300' :
                                    session.game_type === 'VIGI1' ? 'bg-orange-900 text-orange-300' :
                                    session.game_type === 'CAPACITY' ? 'bg-red-900 text-red-300' :
                                    session.game_type === 'CUBE' ? 'bg-pink-900 text-pink-300' :
                                    'bg-purple-900 text-purple-300'
                                }`}>
                                    {session.game_type === 'VIGI' ? 'VIGI 1' : 
                                     session.game_type === 'VIGI1' ? 'VIGI 2' : 
                                     session.game_type}
                                </span>
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                    <Calendar size={12} />
                                    {formatDate(session.started_at)}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <div className="text-gray-400 text-sm mb-1">Score</div>
                                    <div className="text-3xl font-bold text-white">{session.score}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-1 justify-end">
                                        <Clock size={12} /> Duration
                                    </div>
                                    <div className="text-xl text-gray-300 font-mono">{formatDuration(session.duration_seconds)}</div>
                                </div>
                            </div>

                            {/* Detailed Metadata if available */}
                            {session.metadata && (
                                <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400 space-y-1">
                                    {Object.entries(session.metadata).map(([key, value]) => {
                                        // Skip complex objects for now or render them simply
                                        if (typeof value === 'object') return null;
                                        return (
                                            <div key={key} className="flex justify-between">
                                                <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                                <span className="text-gray-200">{String(value)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
