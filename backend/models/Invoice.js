import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true }, // e.g. "Consultation Fee", "Lab Test - CBC"
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true, // auto-generate: INV-000001
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    items: {
      type: [invoiceItemSchema],
      validate: [(arr) => arr.length > 0, 'Invoice must have at least one item'],
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    taxPercent: {
      type: Number,
      default: 0, // e.g. 5 = 5%
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'insurance', 'other'],
      default: 'cash',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Subtotal, tax, discount, total — sab yahan calculate hote hain (source of truth)
invoiceSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  this.taxAmount = Number(((this.subtotal * this.taxPercent) / 100).toFixed(2));
  this.discountAmount = Number(((this.subtotal * this.discountPercent) / 100).toFixed(2));
  this.totalAmount = Number(
    (this.subtotal + this.taxAmount - this.discountAmount).toFixed(2)
  );

  // Payment status amountPaid ke hisaab se auto-update
  if (this.amountPaid <= 0) {
    this.paymentStatus = 'unpaid';
  } else if (this.amountPaid < this.totalAmount) {
    this.paymentStatus = 'partial';
  } else {
    this.paymentStatus = 'paid';
  }
};

invoiceSchema.pre('save', async function (next) {
  this.calculateTotals();

  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;