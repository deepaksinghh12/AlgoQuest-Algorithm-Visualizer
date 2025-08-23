import { Problem } from "@shared/schema";

export interface AnimationState {
  step: number;
  data: any[];
  currentIndices?: number[];
  target?: number;
  found?: boolean;
  comparisons?: number;
}

export function drawVisualization(
  canvas: HTMLCanvasElement,
  problem: Problem,
  state: AnimationState
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (problem.visualizationType) {
    case "array-traversal":
      drawTwoSumVisualization(ctx, canvas, state);
      break;
    case "sorting":
      drawSortingVisualization(ctx, canvas, state, problem.title);
      break;
    default:
      drawDefaultVisualization(ctx, canvas, state);
  }
}

function drawTwoSumVisualization(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: AnimationState
) {
  const { data, step, target = 9 } = state;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const boxWidth = 60;
  const boxHeight = 60;
  const spacing = 80;
  const startX = centerX - ((data.length - 1) * spacing) / 2;

  // Draw title
  ctx.fillStyle = "#1e293b";
  ctx.font = "24px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Two Sum Algorithm", centerX, 50);

  // Draw target
  ctx.fillStyle = "#475569";
  ctx.font = "16px Inter, sans-serif";
  ctx.fillText(`Target: ${target}`, centerX, 80);

  // Draw array elements
  data.forEach((num: number, index: number) => {
    const x = startX + index * spacing;
    const y = centerY - boxHeight / 2;

    // Determine colors based on animation step
    let bgColor = "#3b82f6"; // Default blue
    let textColor = "#ffffff";
    
    if (step > 0) {
      const leftPointer = Math.floor((step - 1) / data.length);
      const rightPointer = (step - 1) % data.length;
      
      if (index === leftPointer || index === rightPointer) {
        bgColor = "#ef4444"; // Red for current pointers
      }
      
      // Check if we found the answer
      if (leftPointer < data.length && rightPointer < data.length) {
        if (data[leftPointer] + data[rightPointer] === target) {
          if (index === leftPointer || index === rightPointer) {
            bgColor = "#10b981"; // Green for solution
          }
        }
      }
    }

    // Draw box
    ctx.fillStyle = bgColor;
    ctx.fillRect(x - boxWidth / 2, y, boxWidth, boxHeight);

    // Draw border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - boxWidth / 2, y, boxWidth, boxHeight);

    // Draw number
    ctx.fillStyle = textColor;
    ctx.font = "20px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(num.toString(), x, y + boxHeight / 2 + 7);

    // Draw index below
    ctx.fillStyle = "#64748b";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText(index.toString(), x, y + boxHeight + 20);
  });

  // Draw step information
  if (step > 0) {
    const leftPointer = Math.floor((step - 1) / data.length);
    const rightPointer = (step - 1) % data.length;
    
    ctx.fillStyle = "#475569";
    ctx.font = "16px Inter, sans-serif";
    ctx.textAlign = "center";
    
    if (leftPointer < data.length && rightPointer < data.length) {
      const sum = data[leftPointer] + data[rightPointer];
      ctx.fillText(
        `Checking: ${data[leftPointer]} + ${data[rightPointer]} = ${sum}`,
        centerX,
        centerY + 100
      );
      
      if (sum === target) {
        ctx.fillStyle = "#10b981";
        ctx.fillText("Solution found!", centerX, centerY + 130);
      }
    }
  }
}

function drawSortingVisualization(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: AnimationState,
  algorithmName: string
) {
  const { data, step } = state;
  const centerX = canvas.width / 2;
  const maxHeight = 200;
  const barWidth = Math.min(60, (canvas.width - 100) / data.length);
  const spacing = barWidth + 10;
  const startX = centerX - ((data.length - 1) * spacing) / 2;
  const baseY = canvas.height - 100;

  // Draw title
  ctx.fillStyle = "#1e293b";
  ctx.font = "24px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(algorithmName, centerX, 50);

  // Find max value for scaling
  const maxValue = Math.max(...data);

  // Draw bars
  data.forEach((value: number, index: number) => {
    const x = startX + index * spacing;
    const height = (value / maxValue) * maxHeight;
    const y = baseY - height;

    // Color based on step (simple animation)
    let color = "#3b82f6";
    if (step > 0 && index === step % data.length) {
      color = "#ef4444"; // Red for current element
    }
    if (step > 0 && index < step % data.length) {
      color = "#10b981"; // Green for sorted elements
    }

    // Draw bar
    ctx.fillStyle = color;
    ctx.fillRect(x - barWidth / 2, y, barWidth, height);

    // Draw value on top
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(value.toString(), x, y - 10);
  });

  // Draw step information
  ctx.fillStyle = "#475569";
  ctx.font = "16px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Step: ${step}`, centerX, canvas.height - 30);
}

function drawDefaultVisualization(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: AnimationState
) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw placeholder
  ctx.fillStyle = "#64748b";
  ctx.font = "20px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Algorithm Visualization", centerX, centerY - 20);
  ctx.fillText("Coming Soon!", centerX, centerY + 20);
}

export function createAnimationSequence(
  problem: Problem,
  testData?: any
): AnimationState[] {
  const sequence: AnimationState[] = [];
  
  if (problem.visualizationType === "array-traversal") {
    const data = testData || [2, 7, 11, 15];
    const target = 9;
    
    // Create step-by-step animation for two sum
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        sequence.push({
          step: sequence.length,
          data,
          currentIndices: [i, j],
          target,
          found: data[i] + data[j] === target,
        });
      }
    }
  } else if (problem.visualizationType === "sorting") {
    // Simple bubble sort animation
    const data = [...(testData || [64, 34, 25, 12, 22, 11, 90])];
    
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length - i - 1; j++) {
        sequence.push({
          step: sequence.length,
          data: [...data],
          currentIndices: [j, j + 1],
        });
        
        if (data[j] > data[j + 1]) {
          [data[j], data[j + 1]] = [data[j + 1], data[j]];
        }
      }
    }
  }
  
  return sequence;
}
