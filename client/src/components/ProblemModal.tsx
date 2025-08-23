import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Play, CheckCircle, XCircle, RotateCcw, Send } from "lucide-react";
import { Problem } from "@shared/schema";
import MonacoEditor from "./MonacoEditor";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProblemModalProps {
  problem: Problem;
  onClose: () => void;
  onVisualize: () => void;
  fullScreen?: boolean;
}

export default function ProblemModal({ problem, onClose, onVisualize, fullScreen = false }: ProblemModalProps) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState((problem.starterCode as Record<string, string>)?.[language] || "");
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }>>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const executeCodeMutation = useMutation({
    mutationFn: async (codeToRun: string) => {
      const response = await apiRequest("POST", "/api/execute", {
        code: codeToRun,
        language,
        input: (problem.testCases as Array<{input: any}>)?.[0]?.input || []
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.error) {
        setTestResults([{ passed: false, message: result.error }]);
      } else {
        // Simple test result simulation
        setTestResults([
          { passed: true, message: "Test Case 1: Passed" },
          { passed: true, message: "Test Case 2: Passed" },
          { passed: false, message: "Test Case 3: Failed" },
        ]);
      }
    },
    onError: () => {
      toast({
        title: "Execution Failed",
        description: "Failed to execute code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/submissions", {
        userId: "current-user-id", // In real app, get from auth context
        problemId: problem.id,
        code,
        language,
        status: "Pending"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submission Successful",
        description: "Your solution has been submitted for evaluation.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit solution. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode((problem.starterCode as Record<string, string>)?.[newLanguage] || "");
  };

  const handleReset = () => {
    setCode((problem.starterCode as Record<string, string>)?.[language] || "");
    setTestResults([]);
  };

  const modalClasses = fullScreen 
    ? "fixed inset-0 bg-white z-50"
    : "fixed inset-0 bg-black bg-opacity-50 z-50";

  return (
    <div className={modalClasses} onClick={fullScreen ? undefined : onClose} data-testid="problem-modal">
      <div className={fullScreen ? "h-full" : "flex h-full"} onClick={(e) => e.stopPropagation()}>
        {/* Problem Description Panel */}
        <div className={`${fullScreen ? "w-1/2" : "w-1/2"} bg-white overflow-y-auto`}>
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" data-testid="text-problem-title">{problem.title}</h2>
              <button 
                className="text-slate-400 hover:text-slate-600"
                onClick={onClose}
                data-testid="button-close-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                problem.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`} data-testid="badge-problem-difficulty">
                {problem.difficulty}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full" data-testid="badge-problem-category">
                {problem.category}
              </span>
              <span className="text-slate-500 text-sm" data-testid="text-acceptance-rate">
                Acceptance: {problem.acceptanceRate}%
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-slate-700 mb-4" data-testid="text-problem-description">
                {problem.description}
              </p>
              
              {problem.examples && Array.isArray(problem.examples) && problem.examples.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                  {(problem.examples as Array<{input: string, output: string, explanation?: string}>).map((example, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg mb-4" data-testid={`example-${index}`}>
                      <pre className="text-sm">
                        <strong>Input:</strong> {example.input}{"\n"}
                        <strong>Output:</strong> {example.output}
                        {example.explanation && (
                          <>
                            {"\n"}
                            <strong>Explanation:</strong> {example.explanation}
                          </>
                        )}
                      </pre>
                    </div>
                  ))}
                </>
              )}
              
              {problem.constraints && problem.constraints.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Constraints:</h3>
                  <ul className="text-slate-700 mb-6">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index} data-testid={`constraint-${index}`}>{constraint}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            
            {/* Visualization Toggle */}
            {problem.visualizationType && (
              <button 
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                onClick={onVisualize}
                data-testid="button-visualize-algorithm"
              >
                <Play className="w-4 h-4 mr-2 inline" />
                Visualize Algorithm
              </button>
            )}
          </div>
        </div>
        
        {/* Code Editor Panel */}
        <div className={`${fullScreen ? "w-1/2" : "w-1/2"} bg-slate-900 flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-4">
              <select 
                className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-600"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                data-testid="select-language"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              <button 
                className="text-slate-400 hover:text-white flex items-center"
                onClick={handleReset}
                data-testid="button-reset-code"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600 transition-colors flex items-center"
                onClick={() => executeCodeMutation.mutate(code)}
                disabled={executeCodeMutation.isPending}
                data-testid="button-run-code"
              >
                <Play className="w-4 h-4 mr-2" />
                {executeCodeMutation.isPending ? "Running..." : "Run"}
              </button>
              <button 
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors flex items-center"
                onClick={() => submitCodeMutation.mutate()}
                disabled={submitCodeMutation.isPending}
                data-testid="button-submit-code"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitCodeMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
          
          {/* Code Editor Area */}
          <div className="flex-1" data-testid="code-editor-area">
            <MonacoEditor
              value={code}
              onChange={setCode}
              language={language}
              theme="vs-dark"
            />
          </div>
          
          {/* Test Results Panel */}
          {testResults.length > 0 && (
            <div className="bg-slate-800 border-t border-slate-700 p-4 max-h-48 overflow-y-auto" data-testid="test-results">
              <h4 className="text-white font-semibold mb-2">Test Results</h4>
              <div className="space-y-2 text-sm">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center" data-testid={`test-result-${index}`}>
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-slate-300">{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
