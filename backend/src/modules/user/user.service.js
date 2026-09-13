import bcrypt from "bcryptjs";
import User from "./user.model.js";

const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    passwordHash,
    authProvider: "local",
    role: "TRAVELER",
  });

  return user;
};

const validatePassword = async (user, password) => {
  if (!user.passwordHash) {
    return false;
  }

  return bcrypt.compare(password, user.passwordHash);
};

const findUserForLogin = async (email) => {
  return User.findOne({
    email: email.toLowerCase(),
  }).select("+passwordHash");
};

export {
  registerUser,
  validatePassword,
  findUserForLogin,
};