import express from "express";

import {
  register,
  login,
  logout,
  getMe,
  getMyProfile,
  updateMyProfile,
} from "./user.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// AUTHENTICATION
// ======================================================

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Get currently authenticated user
router.get("/me", authenticate, getMe);

// ======================================================
// USER PROFILE
// ======================================================

// Get my profile
router.get("/profile", authenticate, getMyProfile);

// Update my profile
router.patch("/profile", authenticate, updateMyProfile);

export default router;