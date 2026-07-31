import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function DepartmentForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    ...initialData,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Department Name *</label>
        <input
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          placeholder="Cardiology"
        />
      </div>

      <div>
        <label className={labelClass}>Department Code *</label>
        <input
          name="code"
          required
          value={form.code}
          onChange={handleChange}
          className={inputClass}
          placeholder="CARD"
          maxLength={10}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={inputClass}
          placeholder="Heart care and cardiovascular treatment unit"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="animate-spin" size={15} />}
          {initialData ? 'Update Department' : 'Add Department'}
        </button>
      </div>
    </form>
  );
}

export default DepartmentForm;