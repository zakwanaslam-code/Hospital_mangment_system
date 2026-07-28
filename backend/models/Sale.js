import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    items: {
      type: [saleItemSchema],
      validate: [(arr) => arr.length > 0, 'Sale must have at least one item'],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

saleSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  next();
});

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;