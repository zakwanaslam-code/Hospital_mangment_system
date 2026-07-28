import asyncHandler from 'express-async-handler';
import Department from '../models/Department.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

// @desc    Create Department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;

  if (!name || !code) {
    res.status(400);
    throw new Error('Name and Code are required');
  }

  const exists = await Department.findOne({ $or: [{ name }, { code }] });
  if (exists) {
    res.status(400);
    throw new Error('Department already exists');
  }

  const department = await Department.create({
    name,
    code,
    description,
    createdBy: req.user._id,
  });

  sendCreated(res, 'Department created successfully', department);
});

// @desc    Get All Departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  sendSuccess(res, 'Departments fetched', departments, { count: departments.length });
});

// @desc    Get Single Department
// @route   GET /api/departments/:id
// @access  Private
export const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  sendSuccess(res, 'Department fetched', department);
});

// @desc    Update Department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = asyncHandler(async (req, res) => {
  const { name, code, description, status } = req.body;

  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  department.name = name ?? department.name;
  department.code = code ?? department.code;
  department.description = description ?? department.description;
  if (typeof status === 'boolean') department.status = status;

  await department.save();

  sendSuccess(res, 'Department updated successfully', department);
});

// @desc    Delete Department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  await department.deleteOne();

  sendSuccess(res, 'Department deleted successfully');
});