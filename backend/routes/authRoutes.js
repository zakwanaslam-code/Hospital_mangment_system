import express from "express";

import {
  register,
  login,
  getProfile,
  changePassword,
  updateProfile,
} from '../controllers/authController.js';

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put('/update-profile', protect, updateProfile);

router.put("/change-password", protect, changePassword);

export default router;