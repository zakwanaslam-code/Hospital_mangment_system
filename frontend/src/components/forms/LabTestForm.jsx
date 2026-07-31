import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { patientService } from '../../services/patientService.js';
import { doctorService } from '../../services/doctorService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function LabTestForm({ onSubmit, onCancel, loading }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    testName: '',
    testType: 'blood',
    price: 0,
    priority: 'normal',
  });

  useEffect(() => {
    patientService.getPatients({ limit: 100 }).then((res) => setPatients(res.data || []));
    doctorService.getDoctors({}).then((res) => setDoctors(res.data || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price) });
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
        <label className={labelClass}>Referring Doctor</label>
        <select name="doctor" value={form.doctor} onChange={handleChange} className={inputClass}>
          <option value="">Select doctor (optional)</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.user?.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Test Name *</label>
        <input
          name="testName"
          required
          value={form.testName}
          onChange={handleChange}
          className={inputClass}
          placeholder="Complete Blood Count (CBC)"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Test Type</label>
          <select name="testType" value={form.testType} onChange={handleChange} className={inputClass}>
            <option value="blood">Blood</option>
            <option value="urine">Urine</option>
            <option value="xray">X-Ray</option>
            <option value="mri">MRI</option>
            <option value="ct_scan">CT Scan</option>
            <option value="ultrasound">Ultrasound</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Price (Rs.)</label>
          <input type="number" min="0" name="price" value={form.price} onChange={handleChange} className={inputClass} />
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
          Request Test
        </button>
      </div>
    </form>
  );
}

export default LabTestForm;