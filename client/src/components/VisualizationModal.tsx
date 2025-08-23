import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { Problem } from "@shared/schema";
import { drawVisualization, AnimationState } from "@/lib/visualizations";

interface VisualizationModalProps {
  problem: Problem | null;
  onClose: () => void;
}

export default function VisualizationModal({ problem, onClose }: VisualizationModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [animationState, setAnimationState] = useState<AnimationState>({ step: 0, data: [] });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (problem?.visualizationType === "array-traversal" || problem?.visualizationType === "sorting") {
      // Initialize visualization data
      const initialData = problem.testCases[0]?.input?.[0] || [2, 7, 11, 15];
      setAnimationState({ step: 0, data: initialData });
    }
  }, [problem]);

  useEffect(() => {
    if (canvasRef.current && problem) {
      drawVisualization(canvasRef.current, problem, animationState);
    }
  }, [animationState, problem]);

  const startAnimation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      animate();
    }
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetAnimation = () => {
    pauseAnimation();
    setAnimationState(prev => ({ ...prev, step: 0 }));
  };

  const animate = () => {
    if (isPlaying) {
      setAnimationState(prev => ({
        ...prev,
        step: prev.step + 1
      }));
      
      const timeout = 1100 - (speed * 100); // Speed control
      setTimeout(() => {
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }, timeout);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animate();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} data-testid="visualization-modal">
      <div className="bg-white rounded-xl m-8 h-full max-w-6xl mx-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" data-testid="text-visualization-title">
              Algorithm Visualizer - {problem?.title || "Unknown Problem"}
            </h2>
            <button 
              className="text-slate-400 hover:text-slate-600"
              onClick={onClose}
              data-testid="button-close-visualization"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <button 
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center"
              onClick={isPlaying ? pauseAnimation : startAnimation}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </button>
            <button 
              className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 flex items-center"
              onClick={resetAnimation}
              data-testid="button-reset-visualization"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-slate-600">Speed:</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-20"
                data-testid="slider-speed"
              />
            </div>
          </div>
        </div>
        
        {/* Visualization Canvas */}
        <div className="p-6 h-full">
          <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 h-full flex items-center justify-center relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="max-w-full max-h-full"
              data-testid="visualization-canvas"
            />
            
            {/* Algorithm Info Overlay */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium mb-1" data-testid="text-algorithm-info">
                {problem?.visualizationType === "array-traversal" ? "Two Sum Algorithm" : 
                 problem?.visualizationType === "sorting" ? "Sorting Algorithm" : 
                 "Algorithm Visualization"}
              </p>
              <p className="text-xs text-slate-600" data-testid="text-step-info">
                Step: {animationState.step}
              </p>
              {animationState.data.length > 0 && (
                <p className="text-xs text-slate-600" data-testid="text-array-info">
                  Array: [{animationState.data.join(", ")}]
                </p>
              )}
              {problem?.testCases?.[0] && (
                <p className="text-xs text-slate-600" data-testid="text-target-info">
                  Target: {problem.testCases[0].input?.[1] || "N/A"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
