import { Problem } from "@shared/schema";

interface ProblemCardProps {
  problem: Problem;
  onClick: () => void;
}

export default function ProblemCard({ problem, onClick }: ProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getTagColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    return colors[index % colors.length];
  };

  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      data-testid={`card-problem-${problem.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-slate-600 font-medium">AlgoQuest Bot</span>
            <span className="text-slate-400">posted a new problem</span>
            <span className="text-slate-400 text-sm">
              {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2" data-testid={`text-title-${problem.id}`}>
            {problem.title}
          </h3>
          <p className="text-slate-600 mb-4 line-clamp-2" data-testid={`text-description-${problem.id}`}>
            {problem.description}
          </p>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span 
              className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}
              data-testid={`badge-difficulty-${problem.id}`}
            >
              {problem.difficulty}
            </span>
            {problem.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={tag}
                className={`px-2 py-1 text-xs font-medium rounded-full ${getTagColor(index)}`}
                data-testid={`badge-tag-${problem.id}-${index}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right ml-4">
          <div className="text-sm text-slate-500 mb-1" data-testid={`text-accepted-${problem.id}`}>
            Accepted: {(problem.acceptedSubmissions ?? 0) >= 1000000 
              ? `${((problem.acceptedSubmissions ?? 0) / 1000000).toFixed(1)}M`
              : `${Math.floor((problem.acceptedSubmissions ?? 0) / 1000)}K`
            }
          </div>
          <div className="text-sm text-slate-500" data-testid={`text-acceptance-rate-${problem.id}`}>
            {problem.acceptanceRate ?? 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
