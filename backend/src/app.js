import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import userRoutes from "./modules/user/user.routes.js";
import preferenceRoutes from "./modules/preferences/preference.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// -------------------------
// Security
// -------------------------
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// -------------------------
// Body Parsing
// -------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// Cookies
// -------------------------
app.use(cookieParser());

// -------------------------
// Rate Limiting
// -------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// -------------------------
// Health Check
// -------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Voyage API is running",
  });
});

// -------------------------
// Routes
// -------------------------

// Authentication + User Profile
app.use("/api/auth", userRoutes);

// Travel Preferences
app.use("/api/preferences", preferenceRoutes);

// -------------------------
// Error Middleware
// MUST BE LAST
// -------------------------
app.use(errorMiddleware);

export default app;