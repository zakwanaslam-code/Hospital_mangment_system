import asyncHandler from 'express-async-handler';
import Ward from '../models/Ward.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

export const createWard = asyncHandler(async (req, res) => {
  const ward = await Ward.create({ ...req.body, createdBy: req.user._id });
  sendCreated(res, 'Ward created successfully', ward);
});

export const getWards = asyncHandler(async (req, res) => {
  const wards = await Ward.find()
    .populate({
      path: "assignedDoctor",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate("beds.patient", "name patientId")
    .sort({ createdAt: -1 });

  sendSuccess(res, "Wards fetched", wards, {
    count: wards.length,
  });
});

export const getWardById = asyncHandler(async (req, res) => {
  const ward = await Ward.findById(req.params.id)
    .populate({
      path: "assignedDoctor",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate("beds.patient", "name patientId");

  if (!ward) {
    res.status(404);
    throw new Error("Ward not found");
  }

  sendSuccess(res, "Ward fetched", ward);
});
 

export const updateWard = asyncHandler(async (req, res) => {
  const ward = await Ward.findById(req.params.id);

  if (!ward) {
    res.status(404);
    throw new Error("Ward not found");
  }

  const {
    name,
    wardType,
    floor,
    assignedDoctor,
    inCharge,
  } = req.body;

  if (name) ward.name = name;
  if (wardType) ward.wardType = wardType;
  if (floor) ward.floor = floor;

  if (assignedDoctor !== undefined) {
    ward.assignedDoctor = assignedDoctor || null;
  }

  if (inCharge !== undefined) {
    ward.inCharge = inCharge;
  }

  await ward.save();

  const updatedWard = await Ward.findById(ward._id)
    .populate({
      path: "assignedDoctor",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate("beds.patient", "name patientId");

  sendSuccess(res, "Ward updated successfully", updatedWard);
});

// @desc Assign / discharge a bed
export const updateBedStatus = asyncHandler(async (req, res) => {
  const { bedNumber, status, patientId } = req.body;
  const ward = await Ward.findById(req.params.id);
  if (!ward) { res.status(404); throw new Error('Ward not found'); }

  const bed = ward.beds.find((b) => b.bedNumber === bedNumber);
  if (!bed) { res.status(404); throw new Error('Bed not found'); }

  bed.status = status;
  bed.patient = status === 'occupied' ? patientId : null;
  await ward.save();

  sendSuccess(res, 'Bed status updated', ward);
});

export const deleteWard = asyncHandler(async (req, res) => {
  const ward = await Ward.findById(req.params.id);
  if (!ward) { res.status(404); throw new Error('Ward not found'); }
  await ward.deleteOne();
  sendSuccess(res, 'Ward deleted successfully');
});

export const getWardStats = asyncHandler(async (req, res) => {
  const wards = await Ward.find();
  const totalBeds = wards.reduce((sum, w) => sum + w.totalBeds, 0);
  const occupied = wards.reduce((sum, w) => sum + w.beds.filter(b => b.status === 'occupied').length, 0);
  sendSuccess(res, 'Ward stats fetched', { totalBeds, occupied, available: totalBeds - occupied, totalWards: wards.length });
});