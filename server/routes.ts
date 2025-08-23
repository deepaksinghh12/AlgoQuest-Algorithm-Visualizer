import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Problems
  app.get("/api/problems", async (req, res) => {
    try {
      const { difficulty, category, tags, search } = req.query;
      
      const filters = {
        difficulty: difficulty ? (Array.isArray(difficulty) ? difficulty : [difficulty]) as string[] : undefined,
        category: category as string,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) as string[] : undefined,
        search: search as string,
      };

      const problems = await storage.getProblemsWithFilters(filters);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  app.get("/api/problems/:id", async (req, res) => {
    try {
      const problem = await storage.getProblem(req.params.id);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problem" });
    }
  });

  // Submissions
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      
      // Execute code and update submission status
      const { status, testCasesPassed, totalTestCases } = await executeCode(
        validatedData.code,
        validatedData.language,
        validatedData.problemId
      );
      
      await storage.updateSubmissionStatus(submission.id, status, testCasesPassed, totalTestCases);
      
      // Update user score if submission is accepted
      if (status === "Accepted") {
        const user = await storage.getUser(validatedData.userId);
        if (user) {
          await storage.updateUserScore(validatedData.userId, (user.score ?? 0) + 10);
          
          // Create activity
          await storage.createActivity({
            userId: validatedData.userId,
            type: "problem_solved",
            description: `You solved a problem`,
            metadata: { problemId: validatedData.problemId }
          });
        }
      }
      
      const updatedSubmission = await storage.getUserSubmissions(validatedData.userId);
      res.json(updatedSubmission[updatedSubmission.length - 1]);
    } catch (error) {
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  app.get("/api/submissions/user/:userId", async (req, res) => {
    try {
      const submissions = await storage.getUserSubmissions(req.params.userId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Contests
  app.get("/api/contests", async (req, res) => {
    try {
      const contests = await storage.getAllContests();
      res.json(contests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contests" });
    }
  });

  app.get("/api/contests/active", async (req, res) => {
    try {
      const contest = await storage.getActiveContest();
      res.json(contest);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active contest" });
    }
  });

  app.post("/api/contests/:id/join", async (req, res) => {
    try {
      const { userId } = req.body;
      await storage.joinContest(req.params.id, userId);
      
      // Create activity
      await storage.createActivity({
        userId,
        type: "contest_joined",
        description: `You joined a contest`,
        metadata: { contestId: req.params.id }
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to join contest" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const users = await storage.getLeaderboard();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Users
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Code execution endpoint
  app.post("/api/execute", async (req, res) => {
    try {
      const { code, language, input } = req.body;
      const result = await executeCodeWithInput(code, language, input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Code execution failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Code execution function
async function executeCode(code: string, language: string, problemId: string) {
  try {
    const problem = await storage.getProblem(problemId);
    if (!problem) {
      return { status: "Problem not found", testCasesPassed: 0, totalTestCases: 0 };
    }

    const testCases = problem.testCases as Array<{ input: any; expectedOutput: any }>;
    let passed = 0;

    for (const testCase of testCases) {
      const result = await executeCodeWithInput(code, language, testCase.input);
      if (JSON.stringify(result.output) === JSON.stringify(testCase.expectedOutput)) {
        passed++;
      }
    }

    const status = passed === testCases.length ? "Accepted" : "Wrong Answer";
    return { status, testCasesPassed: passed, totalTestCases: testCases.length };
  } catch (error) {
    return { status: "Runtime Error", testCasesPassed: 0, totalTestCases: 0 };
  }
}

async function executeCodeWithInput(code: string, language: string, input: any) {
  // Simple code execution simulation
  // In a real implementation, you would use a secure sandbox like Docker
  try {
    if (language === "javascript") {
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
        
        return null;
      `);
      
      const output = func(input);
      return { output, error: null };
    }
    
    // For other languages, return a mock result
    return { output: null, error: "Language not supported in demo" };
  } catch (error) {
    return { output: null, error: error.message };
  }
}
