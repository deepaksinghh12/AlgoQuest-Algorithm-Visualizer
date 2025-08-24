import express from "express";
import Submission from "../models/Submission";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { problemId, code, language, result } = req.body;
    const submission = new Submission({
      problemId,
      userId: req.user.id,   // from JWT
      code,
      language,
      result,
    });
    await submission.save();
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: "Failed to save submission" });
  }
});

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id }).populate("problemId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
