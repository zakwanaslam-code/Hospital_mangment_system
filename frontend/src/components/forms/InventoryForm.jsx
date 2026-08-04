import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const inputClass = 'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function InventoryForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    itemName: '', category: 'equipment', quantity: 0, unit: 'pcs',
    reorderLevel: 10, location: '', purchasePrice: 0, ...initialData,
  });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, quantity: Number(form.quantity), reorderLevel: Number(form.reorderLevel), purchasePrice: Number(form.purchasePrice) });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={labelClass}>Item Name *</label><input name="itemName" required value={form.itemName} onChange={handleChange} className={inputClass} placeholder="Wheelchair" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            <option value="equipment">Equipment</option><option value="consumable">Consumable</option>
            <option value="furniture">Furniture</option><option value="instrument">Instrument</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div><label className={labelClass}>Location</label><input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Ward 3" /></div>
        <div><label className={labelClass}>Quantity *</label><input type="number" min="0" name="quantity" required value={form.quantity} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Unit</label><input name="unit" value={form.unit} onChange={handleChange} className={inputClass} placeholder="pcs" /></div>
        <div><label className={labelClass}>Reorder Level</label><input type="number" min="0" name="reorderLevel" value={form.reorderLevel} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Purchase Price (Rs.)</label><input type="number" min="0" name="purchasePrice" value={form.purchasePrice} onChange={handleChange} className={inputClass} /></div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg">Cancel</button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-70">
          {loading && <Loader2 className="animate-spin" size={15} />}{initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
export default InventoryForm;