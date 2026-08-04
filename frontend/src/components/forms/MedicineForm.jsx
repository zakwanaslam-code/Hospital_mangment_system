import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const inputClass = 'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function MedicineForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: '', genericName: '', category: 'tablet', manufacturer: '',
    batchNumber: '', stockQuantity: 0, reorderLevel: 20, unitPrice: 0,
    expiryDate: '', supplierName: '', supplierContact: '',
    ...initialData,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      stockQuantity: Number(form.stockQuantity),
      reorderLevel: Number(form.reorderLevel),
      unitPrice: Number(form.unitPrice),
      supplier: { name: form.supplierName, contact: form.supplierContact },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Medicine Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Panadol" />
        </div>
        <div>
          <label className={labelClass}>Generic Name</label>
          <input name="genericName" value={form.genericName} onChange={handleChange} className={inputClass} placeholder="Paracetamol" />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            <option value="tablet">Tablet</option>
            <option value="syrup">Syrup</option>
            <option value="injection">Injection</option>
            <option value="capsule">Capsule</option>
            <option value="ointment">Ointment</option>
            <option value="drops">Drops</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Manufacturer</label>
          <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className={inputClass} placeholder="GSK" />
        </div>
        <div>
          <label className={labelClass}>Batch Number</label>
          <input name="batchNumber" value={form.batchNumber} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stock Quantity *</label>
          <input type="number" min="0" name="stockQuantity" required value={form.stockQuantity} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Reorder Level</label>
          <input type="number" min="0" name="reorderLevel" value={form.reorderLevel} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Unit Price (Rs.) *</label>
          <input type="number" min="0" name="unitPrice" required value={form.unitPrice} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Expiry Date *</label>
          <input type="date" name="expiryDate" required value={form.expiryDate?.slice(0,10) || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Supplier Name</label>
          <input name="supplierName" value={form.supplierName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Supplier Contact</label>
          <input name="supplierContact" value={form.supplierContact} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg">Cancel</button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-70">
          {loading && <Loader2 className="animate-spin" size={15} />}
          {initialData ? 'Update Medicine' : 'Add Medicine'}
        </button>
      </div>
    </form>
  );
}
export default MedicineForm;