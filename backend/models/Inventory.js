import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },
  category: { type: String, enum: ['equipment', 'consumable', 'furniture', 'instrument', 'other'], default: 'equipment' },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  unit: { type: String, default: 'pcs' },
  reorderLevel: { type: Number, default: 10 },
  location: { type: String, trim: true },
  purchasePrice: { type: Number, default: 0 },
  supplier: { name: String, contact: String },
  purchaseDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

inventorySchema.virtual('isLowStock').get(function () { return this.quantity <= this.reorderLevel; });
inventorySchema.set('toJSON', { virtuals: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;