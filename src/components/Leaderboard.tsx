import { Trophy, Crown, Users } from 'lucide-react';
import { Fellowship } from '../types';

interface LeaderboardProps {
  leaderboard: Fellowship[];
}

export function Leaderboard({ leaderboard }: LeaderboardProps) {
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-700';
      default: return 'text-gray-600';
    }
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5" />;
    if (index === 1) return <Trophy className="w-5 h-5" />;
    if (index === 2) return <Trophy className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Live Leaderboard</h2>
        <Trophy className="w-8 h-8 text-yellow-500" />
      </div>
      
      <div className="space-y-4">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No scores yet. Waiting for answers...</p>
          </div>
        ) : (
          leaderboard.map((fellowship, index) => (
            <div
              key={fellowship.id}
              className={`flex items-center justify-between p-4 rounded-xl ${
                index < 3 ? 'bg-gradient-to-r from-gray-50 to-white border-2' : 'bg-gray-50'
              } ${index === 0 ? 'border-yellow-300' : index === 1 ? 'border-gray-300' : index === 2 ? 'border-amber-300' : 'border-transparent'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getMedalColor(index)} bg-gray-100`}>
                  {getMedalIcon(index)}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{fellowship.name}</div>
                  <div className="text-sm text-gray-500">Fellowship</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{fellowship.score}</div>
                <div className="text-sm text-gray-500">points</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Participants: {leaderboard.length}</span>
          <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}