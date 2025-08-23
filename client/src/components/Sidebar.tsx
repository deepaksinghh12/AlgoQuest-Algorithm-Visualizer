import { Play } from "lucide-react";

interface SidebarProps {
  filters: {
    difficulty: string[];
    category: string;
    tags: string[];
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  onVisualizationToggle: () => void;
}

export default function Sidebar({ filters, onFiltersChange, onVisualizationToggle }: SidebarProps) {
  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked
      ? [...filters.difficulty, difficulty]
      : filters.difficulty.filter(d => d !== difficulty);
    
    onFiltersChange({
      ...filters,
      difficulty: newDifficulties,
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? category : "",
    });
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto" data-testid="sidebar">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        
        {/* Problem Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Categories</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="rounded border-slate-300 text-primary focus:ring-primary" 
                defaultChecked
                data-testid="checkbox-all-problems"
              />
              <span className="ml-2 text-sm">All Problems</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="rounded border-slate-300 text-primary focus:ring-primary"
                data-testid="checkbox-my-submissions"
              />
              <span className="ml-2 text-sm">My Submissions</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="rounded border-slate-300 text-primary focus:ring-primary"
                data-testid="checkbox-favorites"
              />
              <span className="ml-2 text-sm">Favorites</span>
            </label>
          </div>
        </div>

        {/* Difficulty Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Difficulty</h3>
          <div className="space-y-2">
            {["Easy", "Medium", "Hard"].map(difficulty => (
              <label key={difficulty} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                  checked={filters.difficulty.includes(difficulty)}
                  onChange={(e) => handleDifficultyChange(difficulty, e.target.checked)}
                  data-testid={`checkbox-difficulty-${difficulty.toLowerCase()}`}
                />
                <span className="ml-2 text-sm">{difficulty}</span>
                <span className="ml-auto text-xs text-slate-500">
                  {difficulty === "Easy" ? "124" : difficulty === "Medium" ? "89" : "67"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Categories</h3>
          <div className="space-y-2">
            {[
              "Array",
              "String",
              "Math",
              "Stack",
              "Sorting",
              "Binary Search", 
              "Dynamic Programming",
              "Linked List"
            ].map(tag => (
              <label key={tag} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                  checked={filters.category === tag}
                  onChange={(e) => handleCategoryChange(tag, e.target.checked)}
                  data-testid={`checkbox-tag-${tag.toLowerCase().replace(/ & | /g, "-")}`}
                />
                <span className="ml-2 text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Visualization Toggle */}
        <div className="border-t border-slate-200 pt-4">
          <button 
            className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
            onClick={onVisualizationToggle}
            data-testid="button-algorithm-visualizer"
          >
            <Play className="w-4 h-4 mr-2" />
            Algorithm Visualizer
          </button>
        </div>
      </div>
    </aside>
  );
}
