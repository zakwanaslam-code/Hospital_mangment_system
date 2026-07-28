import asyncHandler from 'express-async-handler';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

// @desc    Create doctor — User account + Doctor profile dono ek sath banata hai
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    avatar,
    department,
    specialization,
    qualification,
    experience,
    consultationFee,
    schedule,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  // Step 1: login account banao role: doctor ke sath
  const user = await User.create({
    name,
    email,
    password,
    phone,
    avatar,
    role: 'doctor',
    department,
  });

  // Step 2: professional profile banao
  const doctor = await Doctor.create({
    user: user._id,
    department,
    specialization,
    qualification,
    experience,
    consultationFee,
    schedule,
  });

  const populated = await doctor.populate([
    { path: 'user', select: 'name email phone avatar' },
    { path: 'department', select: 'name code' },
  ]);

  sendCreated(res, 'Doctor added successfully', populated);
});

// @desc    Get all doctors — search + filter + pagination
// @route   GET /api/doctors?search=&department=&status=&page=1&limit=10
// @access  Private
export const getDoctors = asyncHandler(async (req, res) => {
  const { search, department, status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (department) query.department = department;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  let doctors = await Doctor.find(query)
    .populate('user', 'name email phone avatar')
    .populate('department', 'name code')
    .sort({ createdAt: -1 });

  // Name/email par search — populate ke baad in-memory filter
  // (chota dataset ke liye theek hai; bade scale par $lookup aggregation better hoga)
  if (search) {
    const regex = new RegExp(search, 'i');
    doctors = doctors.filter(
      (d) => regex.test(d.user?.name || '') || regex.test(d.specialization)
    );
  }

  const total = doctors.length;
  const paginated = doctors.slice(skip, skip + Number(limit));

  sendSuccess(res, 'Doctors fetched', paginated, {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    limit: Number(limit),
  });
});

// @desc    Get single doctor — full profile
// @route   GET /api/doctors/:id
// @access  Private
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('user', 'name email phone avatar')
    .populate('department', 'name code')
    .populate('reviews.patient', 'name patientId');

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // "Patients Today" count — Appointment model Step 6 me banega,
  // tab tak yahan 0 rakhte hain (Step 6 me is field ko live query se replace karenge)
  const patientsToday = 0;

  sendSuccess(res, 'Doctor fetched', { ...doctor.toObject(), patientsToday });
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Admin
export const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  const { specialization, qualification, experience, consultationFee, schedule, status, department } =
    req.body;

  if (specialization) doctor.specialization = specialization;
  if (qualification) doctor.qualification = qualification;
  if (experience !== undefined) doctor.experience = experience;
  if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
  if (schedule) doctor.schedule = schedule;
  if (status) doctor.status = status;
  if (department) doctor.department = department;

  await doctor.save();

  sendSuccess(res, 'Doctor updated successfully', doctor);
});

// @desc    Delete doctor (profile + login account dono)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  await User.findByIdAndDelete(doctor.user);
  await doctor.deleteOne();

  sendSuccess(res, 'Doctor removed successfully');
});

// @desc    Add a review for doctor (patient side)
// @route   POST /api/doctors/:id/reviews
// @access  Private
export const addDoctorReview = asyncHandler(async (req, res) => {
  const { patientId, rating, comment } = req.body;

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  doctor.reviews.push({ patient: patientId, rating, comment });
  doctor.recalculateRating();
  await doctor.save();

  sendSuccess(res, 'Review added successfully', doctor);
});

// @desc    Doctor count stat — Dashboard "Doctors" card ke liye
// @route   GET /api/doctors/stats/count
// @access  Private
export const getDoctorStats = asyncHandler(async (req, res) => {
  const total = await Doctor.countDocuments();
  const active = await Doctor.countDocuments({ status: 'active' });

  sendSuccess(res, 'Doctor stats fetched', { total, active });
});