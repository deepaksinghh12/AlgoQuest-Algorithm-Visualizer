import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { User } from "@shared/schema";

export default function Leaderboard() {
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-primary";
      case 2:
        return "bg-slate-600";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="mb-8" data-testid="leaderboard">
      <div className="flex items-center mb-4">
        <Trophy className="w-5 h-5 text-accent mr-2" />
        <h2 className="text-lg font-semibold">Leaderboard</h2>
      </div>
      <div className="space-y-3">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            data-testid={`leaderboard-user-${index + 1}`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 ${getRankColor(index + 1)} rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3`}>
                <span>{index + 1}</span>
              </div>
              <div>
                <div className="font-medium text-sm" data-testid={`text-username-${user.id}`}>
                  {user.username}
                </div>
                <div className="text-xs text-slate-500" data-testid={`text-score-${user.id}`}>
                  {user.score} pts
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        className="w-full mt-4 text-primary text-sm font-medium hover:text-blue-700 transition-colors"
        data-testid="button-view-full-leaderboard"
      >
        View Full Leaderboard
      </button>
    </div>
  );
}
