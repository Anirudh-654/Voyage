import bcrypt from "bcryptjs";

import User from "./user.model.js";

import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../../utils/jwt.js";

// ======================================================
// REGISTER
// ======================================================

export const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
    } = req.body;

    // -------------------------
    // Validation
    // -------------------------

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // -------------------------
    // Check existing user
    // -------------------------

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // -------------------------
    // Hash password
    // -------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    // -------------------------
    // Create user
    // -------------------------

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      authProvider: "local",
      role: role || "TRAVELER",
    });

    // -------------------------
    // Generate JWT
    // -------------------------

    const token = generateToken(user._id);

    setTokenCookie(res, token);

    // -------------------------
    // Response
    // -------------------------

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// LOGIN
// ======================================================

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // -------------------------
    // Validation
    // -------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // -------------------------
    // Find user
    // passwordHash is select:false,
// so explicitly select it here.
// -------------------------

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // -------------------------
    // Check account status
    // -------------------------

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}`,
      });
    }

    // -------------------------
    // Check password
    // -------------------------

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // -------------------------
    // Generate JWT
    // -------------------------

    const token = generateToken(user._id);

    setTokenCookie(res, token);

    // -------------------------
    // Remove password before response
    // -------------------------

    user.passwordHash = undefined;

    // -------------------------
    // Response
    // -------------------------

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// LOGOUT
// ======================================================

export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET MY PROFILE
// ======================================================

export const getMyProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE MY PROFILE
// ======================================================

export const updateMyProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      profileImage,
      location,
    } = req.body;

    // -------------------------
    // Only allow profile fields
    // -------------------------

    if (firstName !== undefined) {
      req.user.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      req.user.lastName = lastName.trim();
    }

    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Bio cannot exceed 500 characters",
        });
      }

      req.user.bio = bio.trim();
    }

    if (profileImage !== undefined) {
      req.user.profileImage = profileImage;
    }

    if (location !== undefined) {
      req.user.location = location;
    }

    // -------------------------
    // Save changes
    // -------------------------

    await req.user.save();

    // -------------------------
    // Response
    // -------------------------

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};