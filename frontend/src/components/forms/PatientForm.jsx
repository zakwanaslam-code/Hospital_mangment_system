import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { departmentService } from '../../services/departmentService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function PatientForm({ initialData, onSubmit, onCancel, loading }) {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'male',
    dob: '',
    bloodGroup: 'unknown',
    department: '',
    ...initialData,
  });

  useEffect(() => {
    departmentService.getDepartments().then((res) => setDepartments(res.data || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Full Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Ahmed Khan" />
        </div>

        <div>
          <label className={labelClass}>Phone *</label>
          <input name="phone" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="03001234567" />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="optional" />
        </div>

        <div>
          <label className={labelClass}>Gender *</label>
          <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Date of Birth *</label>
          <input type="date" name="dob" required value={form.dob?.slice(0, 10) || ''} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Blood Group</label>
          <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputClass}>
            {['unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Department</label>
          <select name="department" value={form.department} onChange={handleChange} className={inputClass}>
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm
                     font-semibold shadow-glow transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="animate-spin" size={15} />}
          {initialData ? 'Update Patient' : 'Add Patient'}
        </button>
      </div>
    </form>
  );
}

export default PatientForm;