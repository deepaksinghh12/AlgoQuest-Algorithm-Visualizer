import { type User, type InsertUser, type Problem, type InsertProblem, type Submission, type InsertSubmission, type Contest, type InsertContest, type Activity, type InsertActivity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserScore(userId: string, score: number): Promise<void>;
  
  // Problems
  getAllProblems(): Promise<Problem[]>;
  getProblem(id: string): Promise<Problem | undefined>;
  getProblemsWithFilters(filters: {
    difficulty?: string[];
    category?: string;
    tags?: string[];
    search?: string;
  }): Promise<Problem[]>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  
  // Submissions
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getUserSubmissions(userId: string): Promise<Submission[]>;
  getProblemSubmissions(problemId: string): Promise<Submission[]>;
  updateSubmissionStatus(submissionId: string, status: string, testCasesPassed: number, totalTestCases: number): Promise<void>;
  
  // Contests
  getAllContests(): Promise<Contest[]>;
  getActiveContest(): Promise<Contest | undefined>;
  createContest(contest: InsertContest): Promise<Contest>;
  joinContest(contestId: string, userId: string): Promise<void>;
  
  // Activities
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(limit?: number): Promise<Activity[]>;
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private problems: Map<string, Problem>;
  private submissions: Map<string, Submission>;
  private contests: Map<string, Contest>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.submissions = new Map();
    this.contests = new Map();
    this.activities = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const sampleUsers = [
      { username: "coderunner24", password: "password123", score: 150, problemsSolved: 15 },
      { username: "User123", password: "password123", score: 150, problemsSolved: 12 },
      { username: "Alice", password: "password123", score: 129, problemsSolved: 10 },
      { username: "Bob", password: "password123", score: 90, problemsSolved: 8 },
    ];

    sampleUsers.forEach(userData => {
      const id = randomUUID();
      const user: User = {
        id,
        ...userData,
        createdAt: new Date(),
      };
      this.users.set(id, user);
    });

    // Create sample problems
    const sampleProblems = [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        category: "Array",
        tags: ["array", "hash-table", "two-pointers"],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        constraints: [
          "2 ≤ nums.length ≤ 10^4",
          "-10^9 ≤ nums[i] ≤ 10^9",
          "-10^9 ≤ target ≤ 10^9"
        ],
        testCases: [
          { input: [[2,7,11,15], 9], expectedOutput: [0,1] },
          { input: [[3,2,4], 6], expectedOutput: [1,2] },
          { input: [[3,3], 6], expectedOutput: [0,1] }
        ],
        starterCode: {
          javascript: "function twoSum(nums, target) {\n    // Write your solution here\n}",
          python: "def two_sum(nums, target):\n    # Write your solution here\n    pass",
          java: "public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n}"
        },
        acceptanceRate: 85,
        acceptedSubmissions: 1200000,
        totalSubmissions: 1411765,
        visualizationType: "array-traversal"
      },
      {
        title: "Bubble Sort",
        description: "Implement the bubble sort algorithm to sort an array of integers in ascending order.",
        difficulty: "Easy",
        category: "Sorting",
        tags: ["array", "sorting"],
        examples: [
          {
            input: "[64, 34, 25, 12, 22, 11, 90]",
            output: "[11, 12, 22, 25, 34, 64, 90]",
            explanation: "The array is sorted using bubble sort algorithm."
          }
        ],
        constraints: [
          "1 ≤ arr.length ≤ 1000",
          "-1000 ≤ arr[i] ≤ 1000"
        ],
        testCases: [
          { input: [[64, 34, 25, 12, 22, 11, 90]], expectedOutput: [11, 12, 22, 25, 34, 64, 90] },
          { input: [[5, 2, 4, 6, 1, 3]], expectedOutput: [1, 2, 3, 4, 5, 6] }
        ],
        starterCode: {
          javascript: "function bubbleSort(arr) {\n    // Write your solution here\n    return arr;\n}",
          python: "def bubble_sort(arr):\n    # Write your solution here\n    return arr",
          java: "public int[] bubbleSort(int[] arr) {\n    // Write your solution here\n    return arr;\n}"
        },
        acceptanceRate: 92,
        acceptedSubmissions: 856000,
        totalSubmissions: 930435,
        visualizationType: "sorting"
      },
      {
        title: "Quick Sort",
        description: "Implement the Quick Sort algorithm to sort an array of integers using a divide and conquer approach.",
        difficulty: "Medium",
        category: "Sorting",
        tags: ["array", "sorting", "divide-and-conquer"],
        examples: [
          {
            input: "[3, 6, 8, 10, 1, 2, 1]",
            output: "[1, 1, 2, 3, 6, 8, 10]",
            explanation: "The array is sorted using quick sort algorithm."
          }
        ],
        constraints: [
          "1 ≤ arr.length ≤ 1000",
          "-1000 ≤ arr[i] ≤ 1000"
        ],
        testCases: [
          { input: [[3, 6, 8, 10, 1, 2, 1]], expectedOutput: [1, 1, 2, 3, 6, 8, 10] },
          { input: [[5, 2, 4, 6, 1, 3]], expectedOutput: [1, 2, 3, 4, 5, 6] }
        ],
        starterCode: {
          javascript: "function quickSort(arr) {\n    // Write your solution here\n    return arr;\n}",
          python: "def quick_sort(arr):\n    # Write your solution here\n    return arr",
          java: "public int[] quickSort(int[] arr) {\n    // Write your solution here\n    return arr;\n}"
        },
        acceptanceRate: 78,
        acceptedSubmissions: 634000,
        totalSubmissions: 812820,
        visualizationType: "sorting"
      }
    ];

    sampleProblems.forEach(problemData => {
      const id = randomUUID();
      const problem: Problem = {
        id,
        ...problemData,
        createdAt: new Date(),
      };
      this.problems.set(id, problem);
    });

    // Create sample contest
    const contestId = randomUUID();
    const contest: Contest = {
      id: contestId,
      title: "Weekly Contest 1 Announced!",
      description: "Join our very first AlgoQuest Weekly Contest and test your problem-solving skills against others! Prizes for the top 3 contestants.",
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      problems: Array.from(this.problems.keys()).slice(0, 3),
      participants: [],
      isActive: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    };
    this.contests.set(contestId, contest);

    // Create sample activities
    const userIds = Array.from(this.users.keys());
    const problemIds = Array.from(this.problems.keys());
    
    const sampleActivities = [
      {
        userId: userIds[0],
        type: "problem_solved",
        description: "You solved Two Sum",
        metadata: { problemId: problemIds[0] }
      },
      {
        userId: userIds[1],
        type: "submission_made",
        description: "User123 submitted Quick Sort",
        metadata: { problemId: problemIds[2] }
      },
      {
        userId: userIds[2],
        type: "problem_solved",
        description: "Alice solved Bubble Sort",
        metadata: { problemId: problemIds[1] }
      },
      {
        userId: userIds[3],
        type: "contest_joined",
        description: "Bob joined Weekly Contest 1",
        metadata: { contestId }
      }
    ];

    sampleActivities.forEach((activityData, index) => {
      const id = randomUUID();
      const activity: Activity = {
        id,
        ...activityData,
        createdAt: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000), // Spread over last few hours
      };
      this.activities.set(id, activity);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      score: 0,
      problemsSolved: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserScore(userId: string, score: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.score = score;
      user.problemsSolved = (user.problemsSolved ?? 0) + 1;
      this.users.set(userId, user);
    }
  }

  async getAllProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async getProblem(id: string): Promise<Problem | undefined> {
    return this.problems.get(id);
  }

  async getProblemsWithFilters(filters: {
    difficulty?: string[];
    category?: string;
    tags?: string[];
    search?: string;
  }): Promise<Problem[]> {
    let problems = Array.from(this.problems.values());

    if (filters.difficulty && filters.difficulty.length > 0) {
      problems = problems.filter(p => filters.difficulty!.includes(p.difficulty));
    }

    if (filters.category) {
      problems = problems.filter(p => p.category === filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      problems = problems.filter(p => 
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      problems = problems.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return problems;
  }

  async createProblem(problem: InsertProblem): Promise<Problem> {
    const id = randomUUID();
    const newProblem: Problem = {
      ...problem,
      id,
      acceptanceRate: 0,
      acceptedSubmissions: 0,
      totalSubmissions: 0,
      createdAt: new Date(),
    };
    this.problems.set(id, newProblem);
    return newProblem;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const newSubmission: Submission = {
      ...submission,
      id,
      runtime: null,
      memory: null,
      testCasesPassed: 0,
      totalTestCases: 0,
      createdAt: new Date(),
    };
    this.submissions.set(id, newSubmission);
    return newSubmission;
  }

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(s => s.userId === userId);
  }

  async getProblemSubmissions(problemId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(s => s.problemId === problemId);
  }

  async updateSubmissionStatus(submissionId: string, status: string, testCasesPassed: number, totalTestCases: number): Promise<void> {
    const submission = this.submissions.get(submissionId);
    if (submission) {
      submission.status = status;
      submission.testCasesPassed = testCasesPassed;
      submission.totalTestCases = totalTestCases;
      this.submissions.set(submissionId, submission);
    }
  }

  async getAllContests(): Promise<Contest[]> {
    return Array.from(this.contests.values());
  }

  async getActiveContest(): Promise<Contest | undefined> {
    return Array.from(this.contests.values()).find(c => c.isActive);
  }

  async createContest(contest: InsertContest): Promise<Contest> {
    const id = randomUUID();
    const newContest: Contest = {
      ...contest,
      id,
      participants: [],
      isActive: false,
      createdAt: new Date(),
    };
    this.contests.set(id, newContest);
    return newContest;
  }

  async joinContest(contestId: string, userId: string): Promise<void> {
    const contest = this.contests.get(contestId);
    if (contest && contest.participants && !contest.participants.includes(userId)) {
      contest.participants.push(userId);
      this.contests.set(contestId, contest);
    }
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = {
      ...activity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getUserActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
