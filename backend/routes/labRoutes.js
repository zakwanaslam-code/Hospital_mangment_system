import express from 'express';
import {
  createLabTest,
  getLabTests,
  getLabTestById,
  updateLabTest,
  uploadLabResult,
  deleteLabTest,
  getLabStats,
} from '../controllers/labController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload, { setUploadFolder } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getLabStats);

router.get('/', protect, getLabTests);
router.get('/:id', protect, getLabTestById);

router.post('/', protect, createLabTest);
router.put('/:id', protect, updateLabTest);
router.delete('/:id', protect, authorize('admin'), deleteLabTest);

// File upload route — pehle folder set karo, phir multer chalao
router.put(
  '/:id/upload',
  protect,
  authorize('admin', 'lab_technician'),
  setUploadFolder('lab-reports'),
  upload.single('resultFile'),
  uploadLabResult
);

export default router;