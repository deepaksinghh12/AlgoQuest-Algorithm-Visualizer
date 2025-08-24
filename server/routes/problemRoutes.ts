import express from "express";
import Problem from "../models/Problem";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Public: Get all problems
router.get("/", async (_req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

// ✅ Public: Get single problem
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problem" });
  }
});

// 🔒 Protected: Create problem
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, difficulty, tags } = req.body;
    const problem = new Problem({ title, description, difficulty, tags });
    await problem.save();
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Failed to create problem" });
  }
});

// 🔒 Protected: Update problem
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update problem" });
  }
});

// 🔒 Protected: Delete problem
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete problem" });
  }
});

export default router;
