import express from "express";
import {
  createDepartment,
  getDepartments,
    getDepartmentById,
     updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Department (Admin Only)
router.post("/", protect, authorize("admin"), createDepartment);

// Get All Departments
router.get("/", protect, getDepartments);
// get a single 
router.get("/:id", protect, getDepartmentById);

router.put("/:id", protect, authorize("admin"), updateDepartment);

router.delete("/:id", protect, authorize("admin"), deleteDepartment);

export default router;