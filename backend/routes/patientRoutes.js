import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientStats,
} from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats/count', protect, getPatientStats);

router.get('/', protect, getPatients);
router.get('/:id', protect, getPatientById);

router.post('/', protect, authorize('admin', 'receptionist', 'doctor'), createPatient);
router.put('/:id', protect, authorize('admin', 'receptionist', 'doctor'), updatePatient);
router.delete('/:id', protect, authorize('admin'), deletePatient);

export default router;