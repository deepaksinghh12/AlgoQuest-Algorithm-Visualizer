// server/auth.ts
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "./models/User.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

function signToken(user: { id: string; username: string }) {
  return jwt.sign(
    { sub: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sanitize(user: any) {
  return {
    id: user.id || user._id?.toString(),
    username: user.username,
    score: user.score ?? 0,
    problemsSolved: user.problemsSolved ?? 0,
    createdAt: user.createdAt,
  };
}

// POST /api/auth/register
router.post(
  "/register",
  body("username").isString().trim().isLength({ min: 3 }),
  body("password").isString().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    try {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: "Username taken" });

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hash });

      const token = signToken({ id: user.id, username: user.username });
      res.json({ token, user: sanitize(user) });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  body("username").isString().trim().notEmpty(),
  body("password").isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const token = signToken({ id: user.id, username: user.username });
      res.json({ token, user: sanitize(user) });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Optional: GET /api/auth/me (JWT required)
router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user: sanitize(user) });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
