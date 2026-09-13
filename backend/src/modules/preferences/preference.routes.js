import express from "express";

import {
  getMyPreferences,
  updateMyPreferences,
} from "./preference.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Get current user's travel preferences
router.get("/", authenticate, getMyPreferences);

// Create or update current user's travel preferences
router.put("/", authenticate, updateMyPreferences);

export default router;