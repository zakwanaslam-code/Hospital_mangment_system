import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { patientService } from '../../services/patientService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

// Common billing items — ek click me item list me add ho jate hain
const QUICK_ITEMS = [
  { label: 'Room Charges (per day)', price: 2000 },
  { label: 'Doctor Consultation Fee', price: 1500 },
  { label: 'Nursing Care Charges', price: 300 },
  { label: 'Medicine', price: 0 },
  { label: 'Lab Test - CBC', price: 800 },
  { label: 'Lab Test - X-Ray', price: 1200 },
  { label: 'Lab Test - Ultrasound', price: 1500 },
  { label: 'Surgery / OT Charges', price: 0 },
  { label: 'Ambulance Service', price: 0 },
  { label: 'Registration Fee', price: 200 },
];

function InvoiceForm({ onSubmit, onCancel, loading }) {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxPercent: 0,
    discountPercent: 0,
    amountPaid: 0,
    paymentMethod: 'cash',
  });

  useEffect(() => {
    patientService.getPatients({ limit: 100 }).then((res) => setPatients(res.data || []));
  }, []);

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = field === 'description' ? value : Number(value);
    setForm({ ...form, items });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0 }] });
  };

  // Quick-add — agar sirf ek khali item ho to usi ko fill kar do, warna naya row add karo
  const addQuickItem = (quickItem) => {
    const items = [...form.items];
    const lastEmpty = items.findIndex((i) => !i.description);
    const newItem = { description: quickItem.label, quantity: 1, unitPrice: quickItem.price };

    if (lastEmpty !== -1) {
      items[lastEmpty] = newItem;
    } else {
      items.push(newItem);
    }
    setForm({ ...form, items });
  };

  const removeItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const subtotal = form.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = (subtotal * form.taxPercent) / 100;
  const discountAmount = (subtotal * form.discountPercent) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Patient *</label>
        <select
          required
          value={form.patient}
          onChange={(e) => setForm({ ...form, patient: e.target.value })}
          className={inputClass}
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
          ))}
        </select>
      </div>

      {/* Quick Add buttons */}
      <div>
        <label className={labelClass}>Quick Add — common items</label>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ITEMS.map((qi) => (
            <button
              key={qi.label}
              type="button"
              onClick={() => addQuickItem(qi)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary
                         border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              + {qi.label}
            </button>
          ))}
        </div>
      </div>

{/* Items */}
      <div>
        <label className={labelClass}>Items *</label>
        <p className="text-xs text-dark-muted mb-3">
          Click a quick-add button above, or type manually below
        </p>

        <div className="space-y-4">
          {form.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border-2 border-dark-border bg-dark-bg/40 p-4 space-y-3
                         shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
            >
              {/* Item number badge — taake har card clearly ek unit lage */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                  Item {idx + 1}
                </span>
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="shrink-0 p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <input
                required
                placeholder="Item name (e.g. Consultation Fee)"
                value={item.description}
                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                className={`${inputClass} bg-white dark:bg-dark-bg/80 font-medium`}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-dark-muted block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    className={`${inputClass} bg-white dark:bg-dark-bg/80`}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-dark-muted block mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                    className={`${inputClass} bg-white dark:bg-dark-bg/80`}
                  />
                </div>
              </div>

              {/* Har item ka apna subtotal — taake pata chale ye line kitne ki bani */}
              <div className="flex justify-between items-center pt-2 border-t border-dark-border/60 text-xs">
                <span className="text-dark-muted">Line total</span>
                <span className="font-semibold text-dark-text">
                  Rs. {(item.quantity * item.unitPrice).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-primary text-xs font-medium mt-3 hover:underline"
        >
          <Plus size={14} /> Add Blank Item
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Tax %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.taxPercent}
            onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Discount %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.discountPercent}
            onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Payment Method</label>
          <select
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            className={inputClass}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="insurance">Insurance</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Amount Paid (Rs.)</label>
        <input
          type="number"
          min="0"
          value={form.amountPaid}
          onChange={(e) => setForm({ ...form, amountPaid: Number(e.target.value) })}
          className={inputClass}
        />
      </div>

      <div className="bg-dark-bg/50 rounded-xl p-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-dark-muted">
          <span>Subtotal</span><span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-dark-muted">
          <span>Tax ({form.taxPercent}%)</span><span>Rs. {taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-dark-muted">
          <span>Discount ({form.discountPercent}%)</span><span>- Rs. {discountAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-dark-text font-semibold pt-1.5 border-t border-white/10">
          <span>Total</span><span>Rs. {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="sticky -bottom-6 -mx-6 px-6 py-4 mt-2 bg-dark-card border-t border-white/10 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="animate-spin" size={15} />}
          Create Invoice
        </button>
      </div>
    </form>
  );
}

export default InvoiceForm;