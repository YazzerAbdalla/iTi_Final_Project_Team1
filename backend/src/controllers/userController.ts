import express, { Request, Response } from "express";
import { login, register } from "../services/userService";

const router = express.Router();

// Login Route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.status(result.statusCode).json({ data: result.data });
  } catch (err) {
    console.error("Login route error:", err); // Log the error for debugging
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// Register Route
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).json({ data: result.data });
  } catch (err) {
    console.error("Registration route error:", err); // Log the error for debugging
    res.status(500).json({ message: "Something went wrong!" });
  }
});

export default router; // Use export default for TypeScript
