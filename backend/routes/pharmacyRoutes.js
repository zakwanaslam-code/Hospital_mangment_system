import express from 'express';
import {
  addMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  createSale,
  getSalesChart,
  getPharmacyStats,
} from '../controllers/pharmacyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getPharmacyStats);
router.get('/sales/chart', protect, getSalesChart);
router.post('/sales', protect, authorize('admin', 'pharmacist'), createSale);

router.get('/medicines', protect, getMedicines);
router.get('/medicines/:id', protect, getMedicineById);
router.post('/medicines', protect, authorize('admin', 'pharmacist'), addMedicine);
router.put('/medicines/:id', protect, authorize('admin', 'pharmacist'), updateMedicine);
router.delete('/medicines/:id', protect, authorize('admin'), deleteMedicine);

export default router;