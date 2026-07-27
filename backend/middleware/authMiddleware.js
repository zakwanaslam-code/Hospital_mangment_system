import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// ===============================
// Protect Routes
// ===============================
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Token from Authorization Header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Token from Cookie
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error("Access denied. Please login first.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Invalid or expired token");
  }
});

// ===============================
// Role Based Authorization
// ===============================
export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      res.status(403);

      throw new Error(
        `Access denied. ${req.user.role} cannot access this resource.`
      );
    }

    next();
  };
};