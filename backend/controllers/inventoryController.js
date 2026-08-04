import asyncHandler from 'express-async-handler';
import Inventory from '../models/Inventory.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

export const createItem = asyncHandler(async (req, res) => {
  const item = await Inventory.create({ ...req.body, createdBy: req.user._id });
  sendCreated(res, 'Item added successfully', item);
});

export const getItems = asyncHandler(async (req, res) => {
  const { search, category, lowStock } = req.query;
  const query = {};
  if (category) query.category = category;
  if (search) query.itemName = { $regex: search, $options: 'i' };
  if (lowStock === 'true') query.$expr = { $lte: ['$quantity', '$reorderLevel'] };
  const items = await Inventory.find(query).sort({ createdAt: -1 });
  sendSuccess(res, 'Inventory fetched', items, { count: items.length });
});

export const getItemById = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  sendSuccess(res, 'Item fetched', item);
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  Object.assign(item, req.body);
  await item.save();
  sendSuccess(res, 'Item updated successfully', item);
});

export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  await item.deleteOne();
  sendSuccess(res, 'Item deleted successfully');
});

export const getInventoryStats = asyncHandler(async (req, res) => {
  const total = await Inventory.countDocuments();
  const lowStock = await Inventory.countDocuments({ $expr: { $lte: ['$quantity', '$reorderLevel'] } });
  sendSuccess(res, 'Inventory stats fetched', { total, lowStock });
});