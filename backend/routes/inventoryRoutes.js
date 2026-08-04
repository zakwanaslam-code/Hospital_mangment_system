import express from 'express';
import { createItem, getItems, getItemById, updateItem, deleteItem, getInventoryStats } from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/stats', protect, getInventoryStats);
router.get('/', protect, getItems);
router.get('/:id', protect, getItemById);
router.post('/', protect, authorize('admin'), createItem);
router.put('/:id', protect, authorize('admin'), updateItem);
router.delete('/:id', protect, authorize('admin'), deleteItem);
export default router;