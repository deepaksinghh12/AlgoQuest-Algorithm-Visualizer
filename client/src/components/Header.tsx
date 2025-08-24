import { Code } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50" data-testid="header">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Code className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-xl font-bold text-slate-800">AlgoQuest</h1>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
            <a 
            href="https://roadmap.sh/" 
            className="nav-link"
            target="_blank"   // open in new tab (remove if you want same tab)
            rel="noopener noreferrer">
            Explore</a>
              <a href="#" className="text-slate-600 hover:text-slate-800" data-testid="link-contests">Contests</a>
              <a href="#" className="text-slate-600 hover:text-slate-800" data-testid="link-discuss">Discuss</a>
              <a href="#" className="text-slate-600 hover:text-slate-800" data-testid="link-leaderboard">Leaderboard</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Welcome, coderunner24!</span>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              data-testid="button-logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
