import express from 'express';
import { createWard, getWards, getWardById, updateWard, updateBedStatus, deleteWard, getWardStats } from '../controllers/wardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/stats', protect, getWardStats);
router.get('/', protect, getWards);
router.get('/:id', protect, getWardById);
router.post('/', protect, authorize('admin'), createWard);
router.put('/:id', protect, authorize('admin'), updateWard);
router.put('/:id/bed', protect, updateBedStatus);
router.delete('/:id', protect, authorize('admin'), deleteWard);
export default router;