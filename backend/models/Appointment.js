import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    startTime: {
      type: String, // "10:30" — calendar drag&drop yahi field update karega
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    // Frontend calendar isi field se color decide karega:
    // scheduled=blue, confirmed=primary, completed=success, cancelled=danger, no_show=warning
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled',
    },
    queueNumber: {
      type: Number, // us doctor ke us din ka token number
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Ek doctor ka same date+time par duplicate slot na bane
appointmentSchema.index({ doctor: 1, date: 1, startTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;