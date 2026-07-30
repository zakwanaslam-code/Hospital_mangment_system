import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { departmentService } from '../../services/departmentService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function DoctorForm({ onSubmit, onCancel, loading }) {
  const [departments, setDepartments] = useState([]);
  const [qualificationInput, setQualificationInput] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    specialization: '',
    qualification: [],
    experience: 0,
    consultationFee: 0,
    schedule: [],
  });

  useEffect(() => {
    departmentService.getDepartments().then((res) => setDepartments(res.data || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addQualification = () => {
    if (!qualificationInput.trim()) return;
    setForm({ ...form, qualification: [...form.qualification, qualificationInput.trim()] });
    setQualificationInput('');
  };

  const removeQualification = (idx) => {
    setForm({ ...form, qualification: form.qualification.filter((_, i) => i !== idx) });
  };

  const toggleDay = (day) => {
    const exists = form.schedule.find((s) => s.day === day);
    if (exists) {
      setForm({ ...form, schedule: form.schedule.filter((s) => s.day !== day) });
    } else {
      setForm({ ...form, schedule: [...form.schedule, { day, startTime: '09:00', endTime: '17:00' }] });
    }
  };

  const updateScheduleTime = (day, field, value) => {
    setForm({
      ...form,
      schedule: form.schedule.map((s) => (s.day === day ? { ...s, [field]: value } : s)),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, experience: Number(form.experience), consultationFee: Number(form.consultationFee) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Full Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Dr. Sara Ahmed" />
        </div>

        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Password *</label>
          <input type="password" name="password" required value={form.password} onChange={handleChange} className={inputClass} placeholder="Login password" />
        </div>

        <div>
          <label className={labelClass}>Phone *</label>
          <input name="phone" required value={form.phone} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Department *</label>
          <select name="department" required value={form.department} onChange={handleChange} className={inputClass}>
            <option value="">Select department</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Specialization *</label>
          <input name="specialization" required value={form.specialization} onChange={handleChange} className={inputClass} placeholder="Cardiologist" />
        </div>
        <div>
          <label className={labelClass}>Experience (years)</label>
          <input type="number" name="experience" min="0" value={form.experience} onChange={handleChange} className={inputClass} />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Consultation Fee (Rs.)</label>
          <input type="number" name="consultationFee" min="0" value={form.consultationFee} onChange={handleChange} className={inputClass} />
        </div>

        {/* Qualifications */}
        <div className="col-span-2">
          <label className={labelClass}>Qualifications</label>
          <div className="flex gap-2 mb-2">
            <input
              value={qualificationInput}
              onChange={(e) => setQualificationInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
              className={inputClass}
              placeholder="e.g. MBBS — press Enter to add"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {form.qualification.map((q, idx) => (
              <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs">
                {q}
                <button type="button" onClick={() => removeQualification(idx)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="col-span-2">
          <label className={labelClass}>Weekly Schedule</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {DAYS.map((day) => {
              const active = form.schedule.some((s) => s.day === day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active ? 'bg-primary text-white' : 'bg-dark-bg/60 text-dark-muted border border-dark-border'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {form.schedule.map((s) => (
            <div key={s.day} className="flex items-center gap-2 mb-2 text-sm">
              <span className="w-10 text-dark-muted">{s.day}</span>
              <input
                type="time"
                value={s.startTime}
                onChange={(e) => updateScheduleTime(s.day, 'startTime', e.target.value)}
                className={inputClass}
              />
              <span className="text-dark-muted">to</span>
              <input
                type="time"
                value={s.endTime}
                onChange={(e) => updateScheduleTime(s.day, 'endTime', e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
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
          Add Doctor
        </button>
      </div>
    </form>
  );
}

export default DoctorForm;