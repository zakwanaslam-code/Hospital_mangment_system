import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

// @desc Create staff (non-doctor, non-admin roles)
export const createStaff = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password, role, phone, department } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      res.status(400);
      throw new Error("User with this email already exists");
    }

    const staff = await User.create({
      name,
      email,
      password,
      role,
      phone,
      department,
    });

    sendCreated(res, "Staff added successfully", staff);

  } catch (err) {
    console.log(err);
    console.log(err.message);
    console.log(err.errors);

    throw err;
  }
});

// @desc Get all staff (excludes doctors — doctors have their own module)
export const getStaff = asyncHandler(async (req, res) => {
  try {
    const { search, role } = req.query;

    const query = { role: { $ne: "doctor" } };

    if (role) query.role = role;
    if (search) query.name = { $regex: search, $options: "i" };

    console.log("Query:", query);

    const staff = await User.find(query)
      .populate("department", "name")
      .sort({ createdAt: -1 });

    console.log("Staff:", staff);

    sendSuccess(res, "Staff fetched", staff, { count: staff.length });
  } catch (error) {
    console.error("GET STAFF ERROR:");
    console.error(error);
    throw error;
  }
});

export const getStaffById = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id).populate('department', 'name');
  if (!staff) { res.status(404); throw new Error('Staff not found'); }
  sendSuccess(res, 'Staff fetched', staff);
});

export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);
  if (!staff) { res.status(404); throw new Error('Staff not found'); }
  const { name, phone, role, department, isActive } = req.body;
  if (name) staff.name = name;
  if (phone) staff.phone = phone;
  if (role) staff.role = role;
  if (department) staff.department = department;
  if (typeof isActive === 'boolean') staff.isActive = isActive;
  await staff.save();
  sendSuccess(res, 'Staff updated successfully', staff);
});

export const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);
  if (!staff) { res.status(404); throw new Error('Staff not found'); }
  await staff.deleteOne();
  sendSuccess(res, 'Staff removed successfully');
});

export const getStaffStats = asyncHandler(async (req, res) => {
  const total = await User.countDocuments({ role: { $ne: 'doctor' } });
  const active = await User.countDocuments({ role: { $ne: 'doctor' }, isActive: true });
  sendSuccess(res, 'Staff stats fetched', { total, active });
});