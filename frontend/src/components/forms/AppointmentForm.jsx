import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { patientService } from '../../services/patientService.js';
import { doctorService } from '../../services/doctorService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function AppointmentForm({ initialData, onSubmit, onCancel, loading }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    department: '',
    date: '',
    startTime: '09:00',
    endTime: '09:30',
    reason: '',
    ...initialData,
  });

  useEffect(() => {
    patientService.getPatients({ limit: 100 }).then((res) => setPatients(res.data || []));
    doctorService.getDoctors({}).then((res) => setDoctors(res.data || []));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctor') {
      // Doctor select karte hi uska department auto-fill ho jaye
      const selectedDoctor = doctors.find((d) => d._id === value);
      setForm({ ...form, doctor: value, department: selectedDoctor?.department?._id || '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Patient *</label>
        <select name="patient" required value={form.patient} onChange={handleChange} className={inputClass}>
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Doctor *</label>
        <select name="doctor" required value={form.doctor} onChange={handleChange} className={inputClass}>
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.user?.name} — {d.specialization}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Date *</label>
          <input type="date" name="date" required value={form.date?.slice(0, 10) || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Start Time *</label>
          <input type="time" name="startTime" required value={form.startTime} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>End Time *</label>
          <input type="time" name="endTime" required value={form.endTime} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Reason</label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          rows={2}
          className={inputClass}
          placeholder="Routine checkup, follow-up, etc."
        />
      </div>

      <div className="sticky -bottom-6 -mx-6 px-6 py-4 mt-2 bg-dark-card border-t border-dark-border flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="animate-spin" size={15} />}
          {initialData ? 'Update Appointment' : 'Book Appointment'}
        </button>
      </div>
    </form>
  );
}

export default AppointmentForm;