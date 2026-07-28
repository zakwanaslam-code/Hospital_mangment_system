import asyncHandler from 'express-async-handler';
import Invoice from '../models/Invoice.js';
import { generateInvoicePDF } from '../utils/generateInvoicePDF.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private
export const createInvoice = asyncHandler(async (req, res) => {
  const { patient, appointment, items, taxPercent, discountPercent, amountPaid, paymentMethod } =
    req.body;

  const invoice = await Invoice.create({
    patient,
    appointment,
    items,
    taxPercent,
    discountPercent,
    amountPaid,
    paymentMethod,
    createdBy: req.user._id,
  });

  const populated = await invoice.populate('patient', 'name patientId phone');

  req.io.emit('invoice:new', populated);

  sendCreated(res, 'Invoice created successfully', populated);
});

// @desc    Get all invoices — filter by status/date/patient
// @route   GET /api/invoices?status=&patient=&from=&to=&page=&limit=
// @access  Private
export const getInvoices = asyncHandler(async (req, res) => {
  const { status, patient, from, to, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) query.paymentStatus = status;
  if (patient) query.patient = patient;
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate('patient', 'name patientId phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Invoice.countDocuments(query),
  ]);

  sendSuccess(res, 'Invoices fetched', invoices, {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate(
    'patient',
    'name patientId phone email'
  );

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  sendSuccess(res, 'Invoice fetched', invoice);
});

// @desc    Update invoice — items/tax/discount/payment record karna
// @route   PUT /api/invoices/:id
// @access  Private
export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  const { items, taxPercent, discountPercent, amountPaid, paymentMethod } = req.body;

  if (items) invoice.items = items;
  if (taxPercent !== undefined) invoice.taxPercent = taxPercent;
  if (discountPercent !== undefined) invoice.discountPercent = discountPercent;
  if (amountPaid !== undefined) invoice.amountPaid = amountPaid;
  if (paymentMethod) invoice.paymentMethod = paymentMethod;

  await invoice.save(); // pre-save hook totals + paymentStatus recalculate karega

  req.io.emit('invoice:updated', invoice);

  sendSuccess(res, 'Invoice updated successfully', invoice);
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  await invoice.deleteOne();
  sendSuccess(res, 'Invoice deleted successfully');
});

// @desc    Download invoice as PDF (Print Invoice button)
// @route   GET /api/invoices/:id/pdf
// @access  Private
export const downloadInvoicePDF = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate(
    'patient',
    'name patientId phone'
  );

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  generateInvoicePDF(invoice, res);
});

// @desc    Dashboard stat — "Revenue" card (paid invoices ka sum)
// @route   GET /api/invoices/stats/revenue
// @access  Private
export const getRevenueStats = asyncHandler(async (req, res) => {
  const result = await Invoice.aggregate([
    { $match: { paymentStatus: { $in: ['paid', 'partial'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } },
  ]);

  const totalRevenue = result[0]?.totalRevenue || 0;

  // Pichle 7 din ka revenue trend — Mini Graph card ke liye
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const trend = await Invoice.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$amountPaid' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  sendSuccess(res, 'Revenue stats fetched', { totalRevenue, trend });
});