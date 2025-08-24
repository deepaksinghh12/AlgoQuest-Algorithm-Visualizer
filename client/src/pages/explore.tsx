import ProblemCard from "@/components/ProblemCard";

export default function Explore() {
  const problem = {
    id: 1,
    title: "Two Sum",
    description: "Find two numbers that add up to a target value.",
    difficulty: "Easy",
    tags: ["Array", "HashMap"],
    createdAt: new Date().toISOString(),
    acceptedSubmissions: 15600,
    acceptanceRate: 55,
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Explore Problems</h2>
      <ProblemCard problem={problem} onClick={() => alert("Clicked!")} />
    </div>
  );
}
