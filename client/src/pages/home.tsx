import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProblemCard from "@/components/ProblemCard";
import Leaderboard from "@/components/Leaderboard";
import RecentActivity from "@/components/RecentActivity";
import ProblemModal from "@/components/ProblemModal";
import VisualizationModal from "@/components/VisualizationModal";
import { Problem, Contest } from "@shared/schema";
import { Search, Trophy, Medal } from "lucide-react";

export default function Home() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: [] as string[],
    category: "",
    tags: [] as string[],
    search: "",
  });

  const { data: problems = [] } = useQuery<Problem[]>({
    queryKey: ["/api/problems", filters],
  });

  const { data: activeContest } = useQuery<Contest>({
    queryKey: ["/api/contests/active"],
  });

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
  };

  const handleVisualizationToggle = () => {
    setShowVisualization(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar 
          filters={filters} 
          onFiltersChange={setFilters}
          onVisualizationToggle={handleVisualizationToggle}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto" data-testid="main-content">
          <div className="p-6">
            {/* Contest Announcement */}
            {activeContest && (
              <div className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl p-6 mb-6" data-testid="contest-announcement">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <Trophy className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium opacity-90">
                        {activeContest.createdAt ? new Date(activeContest.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">{activeContest.title}</h2>
                    <p className="opacity-90 mb-4">{activeContest.description}</p>
                    <button 
                      className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                      data-testid="button-join-contest"
                    >
                      Join Contest
                    </button>
                  </div>
                  <Medal className="w-12 h-12 opacity-60" />
                </div>
              </div>
            )}

            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <input 
                  type="text" 
                  placeholder="Search problems..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  data-testid="input-search"
                />
                <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="select-sort"
                >
                  <option>Sort by: Recent</option>
                  <option>Sort by: Difficulty</option>
                  <option>Sort by: Acceptance Rate</option>
                  <option>Sort by: Title</option>
                </select>
              </div>
            </div>

            {/* Problems List */}
            <div className="space-y-4" data-testid="problems-list">
              {problems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onClick={() => handleProblemClick(problem)}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button 
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                data-testid="button-load-more"
              >
                Load More Problems
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-6">
            <Leaderboard />
            <RecentActivity />
          </div>
        </aside>
      </div>

      {/* Modals */}
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onVisualize={handleVisualizationToggle}
        />
      )}

      {showVisualization && (
        <VisualizationModal
          problem={selectedProblem}
          onClose={() => setShowVisualization(false)}
        />
      )}
    </div>
  );
}
