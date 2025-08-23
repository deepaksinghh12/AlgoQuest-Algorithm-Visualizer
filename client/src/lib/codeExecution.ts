export interface ExecutionResult {
  output: any;
  error: string | null;
  runtime?: number;
  memory?: number;
}

export async function executeCode(
  code: string,
  language: string,
  input: any
): Promise<ExecutionResult> {
  try {
    if (language === "javascript") {
      return executeJavaScript(code, input);
    } else if (language === "python") {
      return executePython(code, input);
    } else if (language === "java") {
      return executeJava(code, input);
    }
    
    return {
      output: null,
      error: `Language ${language} is not supported`,
    };
  } catch (error) {
    return {
      output: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function executeJavaScript(code: string, input: any): ExecutionResult {
  try {
    const startTime = performance.now();
    
    // Create a safe execution context
    const func = new Function("input", `
      ${code}
      
      // Try to find the main function and execute it
      if (typeof twoSum === 'function') {
        return twoSum(...input);
      }
      if (typeof bubbleSort === 'function') {
        return bubbleSort(input[0]);
      }
      if (typeof quickSort === 'function') {
        return quickSort(input[0]);
      }
      if (typeof mergeSort === 'function') {
        return mergeSort(input[0]);
      }
      if (typeof binarySearch === 'function') {
        return binarySearch(...input);
      }
      
      // Generic function detection
      const funcMatch = code.match(/function\\s+(\\w+)/);
      if (funcMatch) {
        const funcName = funcMatch[1];
        if (typeof eval(funcName) === 'function') {
          return eval(funcName)(...input);
        }
      }
      
      return null;
    `);
    
    const output = func(input);
    const endTime = performance.now();
    
    return {
      output,
      error: null,
      runtime: Math.round(endTime - startTime),
      memory: 0, // Memory tracking not available in browser
    };
  } catch (error) {
    return {
      output: null,
      error: error instanceof Error ? error.message : "Execution error",
    };
  }
}

function executePython(code: string, input: any): ExecutionResult {
  // Python execution would require a backend service like Pyodide or server-side execution
  return {
    output: null,
    error: "Python execution not implemented in this demo",
  };
}

function executeJava(code: string, input: any): ExecutionResult {
  // Java execution would require server-side compilation and execution
  return {
    output: null,
    error: "Java execution not implemented in this demo",
  };
}

export function validateTestCase(
  userOutput: any,
  expectedOutput: any
): { passed: boolean; message: string } {
  try {
    const userStr = JSON.stringify(userOutput);
    const expectedStr = JSON.stringify(expectedOutput);
    
    if (userStr === expectedStr) {
      return { passed: true, message: "Test case passed" };
    } else {
      return {
        passed: false,
        message: `Expected: ${expectedStr}, Got: ${userStr}`,
      };
    }
  } catch (error) {
    return {
      passed: false,
      message: "Error comparing outputs",
    };
  }
}
