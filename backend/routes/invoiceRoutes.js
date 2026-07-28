import express from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  downloadInvoicePDF,
  getRevenueStats,
} from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats/revenue', protect, getRevenueStats);

router.get('/', protect, getInvoices);
router.get('/:id', protect, getInvoiceById);
router.get('/:id/pdf', protect, downloadInvoicePDF);

router.post('/', protect, authorize('admin', 'receptionist'), createInvoice);
router.put('/:id', protect, authorize('admin', 'receptionist'), updateInvoice);
router.delete('/:id', protect, authorize('admin'), deleteInvoice);

export default router;