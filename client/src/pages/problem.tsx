import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Problem } from "@shared/schema";
import Header from "@/components/Header";
import ProblemModal from "@/components/ProblemModal";

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: problem, isLoading } = useQuery<Problem>({
    queryKey: ["/api/problems", id],
    queryFn: async () => {
      const response = await fetch(`/api/problems/${id}`);
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Loading problem...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Problem Not Found</h1>
            <p className="text-slate-600">The problem you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <ProblemModal
        problem={problem}
        onClose={() => window.history.back()}
        onVisualize={() => {}}
        fullScreen={true}
      />
    </div>
  );
}
