import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true, // e.g. PT-00001 — auto-generate karenge pre-save hook me
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
      default: 'unknown',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // doctor bhi User model me hi role:'doctor' se store hoga
    },
    allergies: [{ type: String, trim: true }],
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'admitted', 'discharged'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Age virtual field — schema me store nahi karte, dob se calculate karte hain
patientSchema.virtual('age').get(function () {
  if (!this.dob) return null;
  const diff = Date.now() - this.dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});
patientSchema.set('toJSON', { virtuals: true });

// Auto-generate patientId — PT-00001, PT-00002, ...
patientSchema.pre('save', async function (next) {
  if (this.patientId) return next();
  const count = await mongoose.model('Patient').countDocuments();
  this.patientId = `PT-${String(count + 1).padStart(5, '0')}`;
  next();
});

// Search ke liye text index — name, patientId, phone par
patientSchema.index({ name: 'text', patientId: 'text', phone: 'text' });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;