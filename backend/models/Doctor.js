import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // ek User ka sirf ek Doctor profile ho sakta hai
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualification: [{ type: String, trim: true }], // e.g. ["MBBS", "FCPS Cardiology"]
    experience: {
      type: Number, // years
      default: 0,
      min: 0,
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Weekly schedule — Appointment Module isko calendar availability ke liye use karega
    schedule: [
      {
        day: {
          type: String,
          enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        startTime: String, // "09:00"
        endTime: String, // "17:00"
      },
    ],
    reviews: [
      {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'on_leave', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Har review add hone ke baad average rating recalculate ho
doctorSchema.methods.recalculateRating = function () {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.avgRating = Number((sum / this.reviews.length).toFixed(1));
  }
};

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;