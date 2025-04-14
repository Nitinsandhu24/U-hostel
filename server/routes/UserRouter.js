import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyOtp,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/token.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/profile", verifyToken, getUserProfile);
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // ✅ Clears the auth token cookie
  res.status(200).json({ message: "Logged out successfully" });
});
export default router;
