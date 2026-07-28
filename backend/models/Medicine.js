import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    genericName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['tablet', 'syrup', 'injection', 'capsule', 'ointment', 'drops', 'other'],
      default: 'tablet',
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderLevel: {
      type: Number, // isse neeche stock jaye to "Low Stock" alert
      default: 20,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    supplier: {
      name: { type: String, trim: true },
      contact: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    image: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual fields — frontend Medicine Cards par direct use honge
medicineSchema.virtual('isLowStock').get(function () {
  return this.stockQuantity <= this.reorderLevel;
});

medicineSchema.virtual('isExpiringSoon').get(function () {
  const daysToExpiry = (this.expiryDate - Date.now()) / (1000 * 60 * 60 * 24);
  return daysToExpiry <= 30 && daysToExpiry >= 0;
});

medicineSchema.virtual('isExpired').get(function () {
  return this.expiryDate < Date.now();
});

medicineSchema.set('toJSON', { virtuals: true });

medicineSchema.index({ name: 'text', genericName: 'text' });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;