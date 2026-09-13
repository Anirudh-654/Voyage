import jwt from "jsonwebtoken";

// ======================================================
// Generate JWT
// ======================================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// ======================================================
// Verify JWT
// ======================================================

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ======================================================
// Set JWT Cookie
// ======================================================

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ======================================================
// Clear JWT Cookie
// ======================================================

const clearTokenCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });
};

// ======================================================
// Exports
// ======================================================

export {
  generateToken,
  verifyToken,
  setTokenCookie,
  clearTokenCookie,
};