import express from "express";

import {
  createDestinationController,
  getDestinationsController,
  getDestinationController,
  updateDestinationController,
  deleteDestinationController,
} from "./destination.controller.js";

import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all active destinations
// Supports:
// ?search=goa
// ?type=BEACH
// ?city=Goa
// ?state=Goa
router.get("/", getDestinationsController);

// Get one destination
router.get("/:id", getDestinationController);

// ======================================================
// ADMIN ROUTES
// ======================================================

// Create destination
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createDestinationController
);

// Update destination
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateDestinationController
);

// Deactivate destination
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteDestinationController
);

export default router;