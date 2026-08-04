import express from 'express';
import { createStaff, getStaff, getStaffById, updateStaff, deleteStaff, getStaffStats } from '../controllers/staffController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/stats', protect, getStaffStats);
router.get('/', protect, getStaff);
router.get('/:id', protect, getStaffById);
router.post('/', protect, authorize('admin'), createStaff);
router.put('/:id', protect, authorize('admin'), updateStaff);
router.delete('/:id', protect, authorize('admin'), deleteStaff);
export default router;