import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getDoctorQueue,
  getAppointmentStats,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats/today', protect, getAppointmentStats);
router.get('/queue/:doctorId', protect, getDoctorQueue);

router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);

router.post('/', protect, createAppointment);
router.put('/:id', protect, updateAppointment); // status change + drag&drop reschedule dono isi se
router.delete('/:id', protect, deleteAppointment);

export default router;