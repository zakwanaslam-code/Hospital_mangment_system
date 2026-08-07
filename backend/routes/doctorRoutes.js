import express from 'express';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  addDoctorReview,
  getDoctorStats,
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats/count', protect, getDoctorStats);

router.get('/', protect, getDoctors);
router.get('/:id', protect, getDoctorById);

router.get('/me/profile', protect, getMyDoctorProfile);
router.put('/me/profile', protect, updateMyDoctorProfile);

router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

router.post('/:id/reviews', protect, addDoctorReview);

export default router;