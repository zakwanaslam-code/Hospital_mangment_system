import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

// Din ka start/end nikalne ka helper — queue number aur conflict check ke liye
const getDayRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc    Create appointment — auto queue number + double-booking check
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
  const { patient, doctor, department, date, startTime, endTime, reason } = req.body;

  const { start, end } = getDayRange(date);

  // Same doctor, same din, same time slot pehle se booked to nahi?
  const conflict = await Appointment.findOne({
    doctor,
    date: { $gte: start, $lte: end },
    startTime,
    status: { $nin: ['cancelled', 'no_show'] },
  });

  if (conflict) {
    res.status(400);
    throw new Error('This time slot is already booked for the selected doctor');
  }

  // Queue number — us doctor ke us din ke existing appointments count + 1
  const countToday = await Appointment.countDocuments({
    doctor,
    date: { $gte: start, $lte: end },
    status: { $nin: ['cancelled', 'no_show'] },
  });

  const appointment = await Appointment.create({
    patient,
    doctor,
    department,
    date,
    startTime,
    endTime,
    reason,
    queueNumber: countToday + 1,
    createdBy: req.user._id,
  });

  const populated = await appointment.populate([
    { path: 'patient', select: 'name patientId phone avatar' },
    { path: 'doctor', populate: { path: 'user', select: 'name avatar' } },
    { path: 'department', select: 'name code' },
  ]);

  // Real-time: sabko live update bhej do (Recent Activity feed + notifications ke liye)
  req.io.emit('appointment:new', populated);

  sendCreated(res, 'Appointment booked successfully', populated);
});

// @desc    Get appointments — Calendar view ke liye date-range + filters
// @route   GET /api/appointments?from=&to=&doctor=&patient=&status=
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  const { from, to, doctor, patient, status, department } = req.query;

  const query = {};

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  if (doctor) query.doctor = doctor;
  if (patient) query.patient = patient;
  if (status) query.status = status;
  if (department) query.department = department;

  const appointments = await Appointment.find(query)
    .populate('patient', 'name patientId phone avatar')
    .populate('doctor', 'user specialization', null, {
      populate: { path: 'user', select: 'name avatar' },
    })
    .populate('department', 'name code')
    .sort({ date: 1, startTime: 1 });

  sendSuccess(res, 'Appointments fetched', appointments, { count: appointments.length });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
    .populate('department', 'name code');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  sendSuccess(res, 'Appointment fetched', appointment);
});

// @desc    Update appointment — status change YA drag&drop reschedule (date/time)
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const { date, startTime, endTime, status, reason, notes } = req.body;

  // Agar drag&drop se date/time badla hai, to naya conflict check karo
  if (date || startTime) {
    const checkDate = date || appointment.date;
    const checkTime = startTime || appointment.startTime;
    const { start, end } = getDayRange(checkDate);

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      date: { $gte: start, $lte: end },
      startTime: checkTime,
      status: { $nin: ['cancelled', 'no_show'] },
    });

    if (conflict) {
      res.status(400);
      throw new Error('This time slot is already booked for the selected doctor');
    }
  }

  if (date) appointment.date = date;
  if (startTime) appointment.startTime = startTime;
  if (endTime) appointment.endTime = endTime;
  if (status) appointment.status = status;
  if (reason) appointment.reason = reason;
  if (notes) appointment.notes = notes;

  await appointment.save();

  const populated = await appointment.populate([
    { path: 'patient', select: 'name patientId phone avatar' },
    { path: 'doctor', populate: { path: 'user', select: 'name avatar' } },
    { path: 'department', select: 'name code' },
  ]);

  // Real-time update — calendar drag&drop ya status change turant sab clients par reflect ho
  req.io.emit('appointment:updated', populated);

  sendSuccess(res, 'Appointment updated successfully', populated);
});

// @desc    Cancel/Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  await appointment.deleteOne();

  req.io.emit('appointment:deleted', { id: req.params.id });

  sendSuccess(res, 'Appointment deleted successfully');
});

// @desc    Doctor's live queue for today
// @route   GET /api/appointments/queue/:doctorId
// @access  Private
export const getDoctorQueue = asyncHandler(async (req, res) => {
  const { start, end } = getDayRange(new Date());

  const queue = await Appointment.find({
    doctor: req.params.doctorId,
    date: { $gte: start, $lte: end },
    status: { $nin: ['cancelled', 'no_show'] },
  })
    .populate('patient', 'name patientId avatar')
    .sort({ queueNumber: 1 });

  sendSuccess(res, 'Queue fetched', queue);
});

// @desc    Dashboard stat — "Today's Appointments" card
// @route   GET /api/appointments/stats/today
// @access  Private
export const getAppointmentStats = asyncHandler(async (req, res) => {
  const { start, end } = getDayRange(new Date());

  const total = await Appointment.countDocuments({ date: { $gte: start, $lte: end } });
  const completed = await Appointment.countDocuments({
    date: { $gte: start, $lte: end },
    status: 'completed',
  });
  const cancelled = await Appointment.countDocuments({
    date: { $gte: start, $lte: end },
    status: 'cancelled',
  });

  sendSuccess(res, 'Appointment stats fetched', { total, completed, cancelled });
});