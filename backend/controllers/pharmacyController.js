import asyncHandler from 'express-async-handler';
import Medicine from '../models/Medicine.js';
import Sale from '../models/Sale.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import createNotification from "../utils/createNotification.js";


// ===== MEDICINES =====

// @desc    Add medicine
// @route   POST /api/pharmacy/medicines
// @access  Private/Pharmacist/Admin
export const addMedicine = asyncHandler(async (req, res) => {
await createNotification({
  receiver: req.user._id,
  sender: req.user._id,
  title: "Medicine Added",
  message: `${medicine.name} has been added to pharmacy.`,
  type: "pharmacy",
  link: `/pharmacy/${medicine._id}`,
});

  const medicine = await Medicine.create({ ...req.body, createdBy: req.user._id });
  sendCreated(res, 'Medicine added successfully', medicine);
});

// @desc    Get medicines — search + filter (low stock / expiring / category)
// @route   GET /api/pharmacy/medicines?search=&category=&lowStock=true&expiringSoon=true
// @access  Private
export const getMedicines = asyncHandler(async (req, res) => {
  const { search, category, lowStock, expiringSoon, page = 1, limit = 12 } = req.query;

  const query = {};
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { genericName: { $regex: search, $options: 'i' } },
    ];
  }
  if (lowStock === 'true') {
    query.$expr = { $lte: ['$stockQuantity', '$reorderLevel'] };
  }
  if (expiringSoon === 'true') {
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);
    query.expiryDate = { $lte: in30Days, $gte: new Date() };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [medicines, total] = await Promise.all([
    Medicine.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Medicine.countDocuments(query),
  ]);

  sendSuccess(res, 'Medicines fetched', medicines, {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// @desc    Get single medicine
// @route   GET /api/pharmacy/medicines/:id
// @access  Private
export const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }
  sendSuccess(res, 'Medicine fetched', medicine);
});

// @desc    Update medicine (stock adjust, price update, etc.)
// @route   PUT /api/pharmacy/medicines/:id
// @access  Private
export const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  Object.assign(medicine, req.body);
  await medicine.save();

  await createNotification({
  receiver: req.user._id,
  sender: req.user._id,
  title: "Medicine Updated",
  message: `${medicine.name} information has been updated.`,
  type: "pharmacy",
  link: `/pharmacy/${medicine._id}`,
});

  // Stock kam ho jaye to real-time alert bhejo (Dashboard notifications ke liye)
  if (medicine.stockQuantity <= medicine.reorderLevel) {
    req.io.emit('medicine:lowStock', {
      id: medicine._id,
      name: medicine.name,
      stockQuantity: medicine.stockQuantity,
    });
  }

  sendSuccess(res, 'Medicine updated successfully', medicine);
});

// @desc    Delete medicine
// @route   DELETE /api/pharmacy/medicines/:id
// @access  Private/Admin
export const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }
  await medicine.deleteOne();
  
await createNotification({
  receiver: req.user._id,
  sender: req.user._id,
  title: "Medicine Deleted",
  message: `${medicine.name} has been removed from pharmacy.`,
  type: "pharmacy",
  link: "/pharmacy",
});

  sendSuccess(res, 'Medicine deleted successfully');
});

// ===== SALES =====

// @desc    Record a medicine sale — stock automatically kam hoga
// @route   POST /api/pharmacy/sales
// @access  Private
export const createSale = asyncHandler(async (req, res) => {
  const { patient, items } = req.body;

  // Har item ka current price DB se lo, aur stock check + deduct karo
  const saleItems = [];
  for (const item of items) {
    const medicine = await Medicine.findById(item.medicine);
    if (!medicine) {
      res.status(404);
      throw new Error(`Medicine not found: ${item.medicine}`);
    }
    if (medicine.stockQuantity < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${medicine.name}`);
    }

    medicine.stockQuantity -= item.quantity;
    await medicine.save();

    saleItems.push({
      medicine: medicine._id,
      quantity: item.quantity,
      unitPrice: medicine.unitPrice,
    });
  }

  const sale = await Sale.create({ patient, items: saleItems, soldBy: req.user._id });
  const populated = await sale.populate('items.medicine', 'name');

  sendCreated(res, 'Sale recorded successfully', populated);
});

// @desc    Sales chart data — last 7 days revenue from medicine sales
// @route   GET /api/pharmacy/sales/chart
// @access  Private
export const getSalesChart = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const chart = await Sale.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  sendSuccess(res, 'Sales chart data fetched', chart);
});

// @desc    Dashboard stat — "Medicine Stock" card
// @route   GET /api/pharmacy/stats
// @access  Private
export const getPharmacyStats = asyncHandler(async (req, res) => {
  const totalMedicines = await Medicine.countDocuments();
  const lowStockCount = await Medicine.countDocuments({
    $expr: { $lte: ['$stockQuantity', '$reorderLevel'] },
  });
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const expiringSoonCount = await Medicine.countDocuments({
    expiryDate: { $lte: in30Days, $gte: new Date() },
  });

  sendSuccess(res, 'Pharmacy stats fetched', {
    totalMedicines,
    lowStockCount,
    expiringSoonCount,
  });
});