import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      unique: true, // LAB-000001
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    testName: {
      type: String,
      required: [true, 'Test name is required'], // e.g. "Complete Blood Count (CBC)"
      trim: true,
    },
    testType: {
      type: String,
      enum: ['blood', 'urine', 'xray', 'mri', 'ct_scan', 'ultrasound', 'other'],
      default: 'blood',
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['normal', 'urgent'],
      default: 'normal',
    },
    resultFile: {
      type: String, // uploaded PDF/image ka path
      default: '',
    },
    resultSummary: {
      type: String, // quick text result (e.g. "Hemoglobin: 13.5 g/dL - Normal")
      trim: true,
    },
    requestedDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

labTestSchema.pre('save', async function (next) {
  if (this.testId) return next();

  // Sabse recent/highest testId dhoondh kar uske aage +1 karte hain
  // (count use karna risky hai — delete hone par duplicate ban sakta hai)
  const lastTest = await mongoose.model('LabTest')
    .findOne({ testId: { $exists: true } })
    .sort({ createdAt: -1 })
    .select('testId');

  let nextNumber = 1;
  if (lastTest?.testId) {
    const lastNumber = parseInt(lastTest.testId.split('-')[1], 10);
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  this.testId = `LAB-${String(nextNumber).padStart(6, '0')}`;
  next();
});
const LabTest = mongoose.model('LabTest', labTestSchema);
export default LabTest;