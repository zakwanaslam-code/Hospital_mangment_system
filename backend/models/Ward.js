import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
}, { _id: false });

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  wardType: { type: String, enum: ['general', 'icu', 'private', 'emergency', 'maternity', 'pediatric'], default: 'general' },
  totalBeds: { type: Number, required: true, min: 1 },
  beds: [bedSchema],
  floor: { type: String, trim: true },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  inCharge: { type: String, trim: true }, // Nurse/Ward-in-charge ka naam (simple text field)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Ward create hote hi total beds ke hisaab se automatically bed slots generate kar do
wardSchema.pre('save', function (next) {
  if (this.isNew && this.beds.length === 0) {
    for (let i = 1; i <= this.totalBeds; i++) {
      this.beds.push({ bedNumber: `${this.name.slice(0,3).toUpperCase()}-${String(i).padStart(2,'0')}`, status: 'available' });
    }
  }
  next();
});




wardSchema.virtual('occupiedCount').get(function () {
  return this.beds.filter((b) => b.status === 'occupied').length;
});
wardSchema.virtual('availableCount').get(function () {
  return this.beds.filter((b) => b.status === 'available').length;
});
wardSchema.set('toJSON', { virtuals: true });

const Ward = mongoose.model('Ward', wardSchema);
export default Ward;