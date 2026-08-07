import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import createNotification from "../utils/createNotification.js";

// @desc    Create patient
// @route   POST /api/patients
// @access  Private (Admin/Receptionist)
export const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create({ ...req.body, createdBy: req.user._id });
  
await createNotification({
  receiver: req.user._id,
  sender: req.user._id,
  title: "New Patient Registered",
  message: `${patient.name} has been registered successfully.`,
  type: "patient",
  link: `/patients/${patient._id}`,
});
  sendCreated(res, 'Patient registered successfully', patient);
});

 

// @desc    Get all patients — search + filter + pagination
// @route   GET /api/patients?search=&status=&department=&page=1&limit=10
// @access  Private
export const getPatients = asyncHandler(async (req, res) => {
  const { search, status, department, gender, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    // name, patientId, phone — kisi bhi field me match ho jaye
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { patientId: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) query.status = status;
  if (department) query.department = department;
  if (gender) query.gender = gender;

  const skip = (Number(page) - 1) * Number(limit);

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .populate('department', 'name code')
      .populate('assignedDoctor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Patient.countDocuments(query),
  ]);

  sendSuccess(res, 'Patients fetched', patients, {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    limit: Number(limit),
  });
});

// @desc    Get single patient — full detailed profile
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate('department', 'name code')
    .populate('assignedDoctor', 'name email phone')
    .populate('createdBy', 'name email');

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  sendSuccess(res, 'Patient fetched', patient);
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  Object.assign(patient, req.body);
  await patient.save();

  sendSuccess(res, 'Patient updated successfully', patient);
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  await patient.deleteOne();
  sendSuccess(res, 'Patient deleted successfully');
});

// @desc    Dashboard stat — total patients count (Total Patients card ke liye)
// @route   GET /api/patients/stats/count
// @access  Private
export const getPatientStats = asyncHandler(async (req, res) => {
  const total = await Patient.countDocuments();
  const active = await Patient.countDocuments({ status: 'active' });
  const admitted = await Patient.countDocuments({ status: 'admitted' });

  sendSuccess(res, 'Patient stats fetched', { total, active, admitted });
});