import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  score: integer("score").default(0),
  problemsSolved: integer("problems_solved").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const problems = pgTable("problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // 'Easy', 'Medium', 'Hard'
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  examples: json("examples").notNull(), // Array of {input, output, explanation}
  constraints: text("constraints").array().notNull(),
  testCases: json("test_cases").notNull(), // Array of {input, expectedOutput}
  starterCode: json("starter_code").notNull(), // Object with language keys
  acceptanceRate: integer("acceptance_rate").default(0),
  acceptedSubmissions: integer("accepted_submissions").default(0),
  totalSubmissions: integer("total_submissions").default(0),
  visualizationType: text("visualization_type"), // 'sorting', 'searching', 'graph', etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  problemId: varchar("problem_id").notNull().references(() => problems.id),
  code: text("code").notNull(),
  language: text("language").notNull(),
  status: text("status").notNull(), // 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', etc.
  runtime: integer("runtime"), // in milliseconds
  memory: integer("memory"), // in KB
  testCasesPassed: integer("test_cases_passed").default(0),
  totalTestCases: integer("total_test_cases").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contests = pgTable("contests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  problems: text("problems").array().notNull(), // Array of problem IDs
  participants: text("participants").array().default([]), // Array of user IDs
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'problem_solved', 'contest_joined', 'submission_made'
  description: text("description").notNull(),
  metadata: json("metadata"), // Additional data like problem_id, contest_id, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
  acceptanceRate: true,
  acceptedSubmissions: true,
  totalSubmissions: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
  runtime: true,
  memory: true,
  testCasesPassed: true,
  totalTestCases: true,
});

export const insertContestSchema = createInsertSchema(contests).omit({
  id: true,
  createdAt: true,
  participants: true,
  isActive: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Contest = typeof contests.$inferSelect;
export type InsertContest = z.infer<typeof insertContestSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
