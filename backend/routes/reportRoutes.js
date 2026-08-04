import express from 'express';
import { getOverviewReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/overview', protect, getOverviewReport);
export default router;