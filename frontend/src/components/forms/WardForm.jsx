import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const inputClass = 'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function WardForm({ onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: '', wardType: 'general', totalBeds: 10, floor: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...form, totalBeds: Number(form.totalBeds) }); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={labelClass}>Ward Name *</label><input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="General Ward A" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Ward Type</label>
          <select name="wardType" value={form.wardType} onChange={handleChange} className={inputClass}>
            <option value="general">General</option><option value="icu">ICU</option><option value="private">Private</option>
            <option value="emergency">Emergency</option><option value="maternity">Maternity</option><option value="pediatric">Pediatric</option>
          </select>
        </div>
        <div><label className={labelClass}>Floor</label><input name="floor" value={form.floor} onChange={handleChange} className={inputClass} placeholder="2nd Floor" /></div>
        <div className="col-span-2"><label className={labelClass}>Total Beds *</label><input type="number" min="1" name="totalBeds" required value={form.totalBeds} onChange={handleChange} className={inputClass} /></div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg">Cancel</button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-70">
          {loading && <Loader2 className="animate-spin" size={15} />}Create Ward
        </button>
      </div>
    </form>
  );
}
export default WardForm;