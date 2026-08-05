import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { patientService } from '../../services/patientService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

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

      {/* Items */}
      <div>
        <label className={labelClass}>Items *</label>
        <p className="text-xs text-dark-muted mb-3">
          Add each billable item — e.g. Consultation Fee, Lab Test, Medicine
        </p>

        <div className="space-y-3">
          {form.items.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  required
                  placeholder="Item name (e.g. Consultation Fee)"
                  value={item.description}
                  onChange={(e) => updateItem(idx, 'description', e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="shrink-0 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-dark-muted block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-dark-muted block mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-primary text-xs font-medium mt-3 hover:underline"
        >
          <Plus size={14} /> Add Item
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