import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Routes
import userRoutes from "./modules/user/user.routes.js";
import preferenceRoutes from "./modules/preferences/preference.routes.js";
import destinationRoutes from "./modules/destination/destination.routes.js";

// Error middleware
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// ======================================================
// SECURITY
// ======================================================

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ======================================================
// BODY PARSING
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================================
// COOKIE PARSER
// ======================================================

app.use(cookieParser());

// ======================================================
// RATE LIMITING
// ======================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Voyage API is running",
  });
});

// ======================================================
// API ROUTES
// ======================================================

// Authentication + User Profile
app.use("/api/auth", userRoutes);

// Travel Preferences
app.use("/api/preferences", preferenceRoutes);

// Destinations
app.use("/api/destinations", destinationRoutes);

// ======================================================
// ERROR HANDLING
// MUST BE LAST
// ======================================================

app.use(errorMiddleware);

export default app;